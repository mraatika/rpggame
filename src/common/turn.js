import {toArray} from 'lodash';
import {PriorityQueue, Queue} from 'datastructures';
import Actor from 'sprites/actor';
import CommandDispatcher from 'commands/commanddispatcher';
import CommandTypes from 'commands/commandtypes';
import Events from 'events/events';
import Actions from 'actions/actions';
import ActionTypes from 'actions/actiontypes';
import TurnPhases from 'common/turnphases';


const hasHigherPriority = (a, b) => {
    return a.priority - b.priority;
};

/**
 * @class Turn
 * @description A class representing a single turn in the game
 */
export default class Turn {

    get phases() {
        return this._phases;
    }

    get actions() {
        return this._actions;
    }

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

        this._actions = new PriorityQueue(hasHigherPriority);
        this._phases = new Queue(...toArray(TurnPhases));
        this.currentPhase = null;

        this.isDone = false;
    }

    /**
     * Start the turn
     */
    start() {
        this._nextPhase();

        if (this.isDone) return;

        this.actor.throwMovement();

        CommandDispatcher.add(this._handleCommand, this);

        new Events.StartTurnEvent(this.actor).dispatch();
    }

    /**
     * Update lifecycle method. Called on every game loop update.
     */
    update() {
        const action = this._actions.peek();
        let success = false;

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
        if (!this._pendingAction) {
            success = action.execute();
        }

        // if the action was immediately successfull or a pending action was resolved then
        // check if the action is done and forget the pending action
        if (success || (this._pendingAction && !this._pendingAction.pending)) {
            if (action.isDone) {
                // if action is done and it's type is not end action then dispatch an event manually here
                // otherwise it won't get send
                if (action.type !== ActionTypes.END_ACTION_ACTION) {
                    new Events.EndActionEvent(action.actor, this._phases.peek()).dispatch();
                }

                this._nextPhase();
            }

            this._pendingAction = null;
        }

        // if the action is pending then memorize it so that it won't get executed again
        // when the update loop reaches it after it is no longer pending
        if (action.pending) {
            this._pendingAction = action;

        // if the latest action was resolved then remove it from the actions queue
        } else {
            this._actions.next();
        }
    }

     /**
     * Clean up. Remove event listeners etc.
     */
    dispose() {
        CommandDispatcher.remove(this._handleCommand, this);
    }

    /**
     * Start the next phase
     * @private
     */
    _nextPhase() {
        this.currentPhase = this._phases.next();

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
    _handleCommand(command) {
        const phase = this.currentPhase;

        // if it's not the actor's turn
        if (command.actor !== this.actor) {
            return;
        }

        // only move on move phase
        if (phase === TurnPhases.MOVE_PHASE && command.type === CommandTypes.MOVE_COMMAND) {
            this._actions.add(new Actions.MovementAction(this.state.game, command));
        }

        // only attack on action phase
        if (phase === TurnPhases.ACTION_PHASE && command.type === CommandTypes.ATTACK_COMMAND) {
            this._actions.add(new Actions.AttackAction(command));
        }

        if (command.type === CommandTypes.LOOT_COMMAND) {
            this._actions.add(new Actions.LootAction(command));
        }

        if (command.type === CommandTypes.END_ACTION_COMMAND) {
            this._actions.add(new Actions.EndActionAction(command, this._phases.peek()));
        }

        if (command.type === CommandTypes.END_TURN_COMMAND) {
            this._actions.add(new Actions.EndTurnAction(command, this));
        }
    }
}