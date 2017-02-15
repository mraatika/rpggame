import { values } from 'lodash';
import { PriorityQueue, Queue } from 'datastructures';
import Actor from '../sprites/actor';
import CommandDispatcher from '../commands/commanddispatcher';
import CommandTypes from '../constants/commandtypes';
import Events from '../events/events';
import Actions from '../actions/actions';
import ActionTypes from '../constants/actiontypes';
import TurnPhases from '../constants/turnphases';

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
 * @class Turn
 * @description A class representing a single turn in the game
 */
export default class Turn {
    /**
     * @constructor
     * @param       {Phaser.Game} game Phaser.Game object
     * @param       {Phaser.TileMap} map
     * @param       {Phaser.Sprite} actor The subject in turn
     * @return      {Turn}
     */
    constructor(state, actor) {
        if (!(actor instanceof Actor)) {
            throw new Error('InvalidArgumentsException: Actor invalid or missing!');
        }

        this.state = state;
        this.actor = actor;

        this.actions = new PriorityQueue(sortByPendingAndPriority);
        this.phases = new Queue(...values(TurnPhases));
        this.currentPhase = null;

        this.isDone = false;
    }

    /**
     * Start the turn
     */
    start() {
        this.nextPhase();

        if (this.isDone) return;

        this.actor.throwMovement();

        CommandDispatcher.add(this.handleCommand, this);

        new Events.StartTurnEvent(this.actor).dispatch();
    }

    /**
     * Update lifecycle method. Called on every game loop update.
     */
    update() {
        const action = this.pendingAction || this.actions.peek();

        if (!this.actor.alive) {
            this.isDone = true;
            return;
        }

        // if there's no action in queue...
        if (!action) {
            // ... and it's npc's turn then decide what to do
            if (!this.actor.isPlayerControlled) { this.actor.decideAction(this); }
            // ...and in any case quit the loop
            return;
        }

        // quit the loop if an action is pending
        if (action.pending) return;

        // execute the action if no pending action was found
        if (action !== this.pendingAction) {
            action.execute();
        }

        // if the action is pending then memorize it so that it won't get executed again
        // when the update loop reaches it after it is no longer pending
        if (action.pending) {
            this.pendingAction = action;
            return;
        }

        if (action.isDone) {
            // if action is done and it's type is not end action then
            // dispatch an event manually here otherwise it won't get sent
            if (action.type !== ActionTypes.END_ACTION_ACTION) {
                new Events.EndActionEvent(action.actor, this.phases.peek()).dispatch();
            }

            this.nextPhase();
        }

        this.pendingAction = null;
        this.actions.next();
    }

     /**
     * Clean up. Remove event listeners etc.
     */
    dispose() {
        CommandDispatcher.remove(this.handleCommand, this);
    }

    /**
     * Start the next phase
     * @private
     */
    nextPhase() {
        this.currentPhase = this.phases.next();
        this.actions.empty();

        if (!this.currentPhase) {
            this.isDone = true;
            new Events.EndTurnEvent(this.actor).dispatch();
        }
    }

    /**
     * Add an action to the queue that corresponds the given command
     * @private
     * @param   {Command} command
     */
    handleCommand(command) {
        const phase = this.currentPhase;

        // if it's not the actor's turn
        if (command.actor !== this.actor) {
            return;
        }

        // only move on move phase
        if (phase === TurnPhases.MOVE_PHASE && command.type === CommandTypes.MOVE_COMMAND) {
            this.actions.add(new Actions.MovementAction(this.state.game, command));
        }

        // only attack on action phase
        if (phase === TurnPhases.ACTION_PHASE && command.type === CommandTypes.ATTACK_COMMAND) {
            this.actions.add(new Actions.AttackAction(command));
        }

        if (command.type === CommandTypes.LOOT_COMMAND) {
            this.actions.add(new Actions.LootAction(command));
        }

        if (command.type === CommandTypes.END_ACTION_COMMAND) {
            this.actions.add(new Actions.EndActionAction(command, this.phases.peek()));
        }

        if (command.type === CommandTypes.END_TURN_COMMAND) {
            this.actions.add(new Actions.EndTurnAction(command, this));
        }
    }
}
