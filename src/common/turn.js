import {toArray} from 'lodash';
import {Queue} from 'datastructures';
import Actor from 'sprites/actor';
import CommandDispatcher from 'commands/commanddispatcher';
import EventDispatcher from 'common/eventdispatcher';
import CommandTypes from 'commands/commandtypes';
import EventTypes from 'common/eventtypes';
import ActionTypes from 'actions/actiontypes';
import TurnPhases from 'common/turnphases';
import AttackAction from 'actions/attackaction';
import MovementAction from 'actions/movementaction';
import EndActionAction from 'actions/endactionaction';

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
     * @param       {Array} allActors
     * @return      {Turn}
     */
    constructor(state, actor, allActors) {

        if (!(actor instanceof Actor)) {
            throw new Error('InvalidArgumentsException: Actor invalid or missing!');
        }

        this.state = state;
        this.actor = actor;
        this.allActors = allActors;

        this._actions = new Queue();
        this._phases = new Queue(...toArray(TurnPhases));
        this.currentPhase = null;

        this.isDone = false;
    }

    start() {
        this._nextPhase();
        this.actor.throwMovement();
        CommandDispatcher.add(this._handleCommand, this);
    }

    dispose() {
        CommandDispatcher.remove(this._handleCommand, this);
    }

    update() {
        const action = this._actions.peek();
        let success = false;

        // if there's no action in queue...
        if (!action) {
            // ... and it's npc's turn then decide what to do
            if (!this.actor.isPlayerControlled) { this.actor.decideAction(this); }
            // ...and in any case quit the loop
            return;
        }

        // quit the loop if an action is pending
        if (action.pending) return;

        // if pending action is resolved then forget it
        if (this._pendingAction) {
            this._pendingAction = null;
        // execute the action if no pending action was found
        } else {
            success = action.execute();
        }

        // if the action's execution was successfull (and it was executed)
        if (success) {
            this._dispatchEvent(action);

            if (action.isDone) {
                // if action is done and it's type is not end action then dispatch an event manually here
                // otherwise it won't get send
                if (action.type !== ActionTypes.END_ACTION_ACTION) {
                    this._dispatchEvent({ type: ActionTypes.END_ACTION_ACTION, actor: action.actor });
                }

                this._nextPhase();
            }
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

    _nextPhase() {
        this.currentPhase = this._phases.next();

        if (!this.currentPhase) {
            this.isDone = true;
        }
    }

    _dispatchEvent(action) {
        switch (action.type) {
        case ActionTypes.MOVE_ACTION:
            {
                const lastPoint = action.path[action.path.length - 1];
                console.log(`${action.actor.name} is moving to ${lastPoint.x}, ${lastPoint.y}. Movement left: ${action.actor.movementPoints}`);
                EventDispatcher.dispatch(EventTypes.MOVE_EVENT, { actor: action.actor, endPoint: lastPoint });
                break;
            }
        case ActionTypes.ATTACK_ACTION:
            console.log(`${action.actor.name} is attacking ${action.target.name}`);
            EventDispatcher.dispatch(EventTypes.ATTACK_EVENT, { actor: action.actor, target: action.target });
            break;
        case ActionTypes.END_ACTION_ACTION:
            console.log(`${action.actor.name} is ending phase ${this.currentPhase.toString()}`);
            EventDispatcher.dispatch(EventTypes.END_ACTION_EVENT, { actor: action.actor, phase: this._phases.peek() });
            break;
        }

    }

    _handleCommand(command) {
        const phase = this.currentPhase;

        // if it's not the actors turn
        if (command.actor !== this.actor) {
            return;
        }

        if (phase === TurnPhases.MOVE_PHASE && command.type === CommandTypes.MOVE_COMMAND) {
            this._actions.add(new MovementAction(this.state.game, command));
        }

        if (phase === TurnPhases.ACTION_PHASE && command.type === CommandTypes.ATTACK_COMMAND) {
            this._actions.add(new AttackAction(command));
        }

        if (command.type === CommandTypes.END_ACTION_COMMAND) {
            this._actions.add(new EndActionAction(command));
        }
    }
}