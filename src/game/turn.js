import { values } from 'lodash';
import { PriorityQueue, Queue } from 'datastructures';
import CommandDispatcher from '../commands/commanddispatcher';
import CommandTypes from '../constants/commandtypes';
import EventTypes from '../constants/eventtypes';
import { sendEvent } from '../events/eventdispatcher';
import ActionTypes from '../constants/actiontypes';
import TurnPhases from '../constants/turnphases';
import { shouldBeActorSprite } from '../utils/validations';
import movementAction from '../actions/movementaction';
import lootAction from '../actions/lootaction';
import endActionAction from '../actions/endactionaction';
import attackAction from '../actions/attackaction';
import endTurnAction from '../actions/endturnaction';

/**
 * Sorter functions for sorting actions by pending status and priority.
 * Pending actions will always be in front of the queue.
 * @param {Action} a
 * @param {Action} b
 * @returns {number}
 */
const sortByPendingAndPriority = (a, b) => {
    if (a.pending) return -1;
    if (b.pending) return 1;
    return b.priority - a.priority;
};

/**
 * Convert path to movement actions
 * @param {Game} game
 * @param {Command} command
 * @returns {Action[]}
 */
function pathToMovementActions(game, command) {
    const { actor, path } = command;
    const actions = [];

    for (let i = 0, len = path.length; i < len; i++) {
        const start = path[i];
        const end = path[i + 1];
        if (end) {
            const action = movementAction(game, { actor, path: [start, end] });
            actions.push(action);
        }
    }

    return actions;
}

/**
 * @class Turn
 * @description A class representing a single turn in the game
 * @param {Phaser.State} state
 * @param {ActorSprite} actor The subject in turn
 * @return {Turn}
 */
export default function createTurn(state, actor) {
    if (shouldBeActorSprite(actor)) {
        throw new Error('InvalidArgumentsException: Actor invalid or missing!');
    }

    const phases = new Queue(...values(TurnPhases));
    let pendingAction = null;

    const publicProps = {
        actor,
        state,
        currentPhase: null,
        isDone: false,
        actions: new PriorityQueue(sortByPendingAndPriority),
    };

    const methods = {
        /**
         * Start the turn
         */
        start() {
            if (this.currentPhase || this.isDone) return;

            this.nextPhase();

            actor.throwMovement();

            CommandDispatcher.add(this.handleCommand, this);

            sendEvent(EventTypes.START_TURN_EVENT, { actor });
        },

        /**
         * Update lifecycle method. Called on every game loop update.
         */
        update() {
            const action = pendingAction || this.actions.peek();

            if (!actor.alive) {
                this.isDone = true;
                return;
            }

            // if there's no action in queue...
            if (!action) {
                // ... and it's npc's turn then decide what to do
                if (!actor.isPlayerControlled) { actor.decideAction(this); }
                // ...and in any case quit the loop
                return;
            }

            // quit the loop if an action is pending
            if (action.pending) return;

            // execute the action if no pending action was found
            if (action !== pendingAction) {
                action.execute();
            }

            // if the action is pending then memorize it so that it won't get executed again
            // when the update loop reaches it after it is no longer pending
            if (action.pending) {
                pendingAction = action;
                return;
            }

            if (action.isDone) {
                // if action is done and it's type is not end action then
                // dispatch an event manually here otherwise it won't get sent
                if (action.type !== ActionTypes.END_ACTION_ACTION) {
                    const nextPhase = phases.peek();
                    sendEvent(EventTypes.END_ACTION_EVENT, { actor, phase: nextPhase });
                }

                this.nextPhase();
            }

            pendingAction = null;
            this.actions.next();
        },

        /**
         * Clean up. Remove event listeners etc.
         */
        dispose() {
            CommandDispatcher.remove(this.handleCommand, this);
        },

        /**
         * Start the next phase
         * @private
         */
        nextPhase() {
            this.currentPhase = phases.next();
            this.actions.empty();

            if (!this.currentPhase) {
                this.isDone = true;
                sendEvent(EventTypes.END_TURN_EVENT, { actor });
            }
        },

        /**
         * Add an action to the queue that corresponds the given command
         * @private
         * @param   {Command} command
         */
        handleCommand(command) {
            const phase = this.currentPhase;

            // if it's not the actor's turn
            if (command.actor !== actor) {
                return;
            }

            // only move on move phase
            if (phase === TurnPhases.MOVE_PHASE && command.type === CommandTypes.MOVE_COMMAND) {
                const moveActions = pathToMovementActions(state.game, command);
                this.actions.add(...moveActions);
            }

            // only attack on action phase
            if (phase === TurnPhases.ACTION_PHASE && command.type === CommandTypes.ATTACK_COMMAND) {
                this.actions.add(attackAction(command));
            }

            if (command.type === CommandTypes.LOOT_COMMAND) {
                this.actions.add(lootAction(command));
            }

            if (command.type === CommandTypes.END_ACTION_COMMAND) {
                const props = Object.assign({}, command, { nextPhase: phases.peek() });
                this.actions.add(endActionAction(props));
            }

            if (command.type === CommandTypes.END_TURN_COMMAND) {
                const props = Object.assign({}, command, { turn: this });
                this.actions.add(endTurnAction(props));
            }
        },
    };

    return Object.assign(
        {},
        publicProps,
        methods,
    );
}
