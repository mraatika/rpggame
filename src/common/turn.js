import {toArray} from 'lodash';
import {Queue} from 'datastructures';
import Actor from 'sprites/actor';
import CommandDispatcher from 'commands/commanddispatcher';
import EventDispatcher from 'common/eventdispatcher';
import CommandTypes from 'commands/commandtypes';
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
        this.isActionDone = false;
    }

    start() {
        this._nextPhase();
        this.actor.throwMovement();

        console.log(`${this.actor.name} THREW ${this.actor.movementPoints} MOVEMENT POINTS`);

        CommandDispatcher.add(this._handleCommand, this);
    }

    dispose() {
        CommandDispatcher.remove(this._handleCommand, this);
    }

    update() {
        const action = this._actions.peek();

        if (!action) {
            if (!this.actor.isPlayerControlled) { this.actor.decideAction(this); }
            return;
        }

        const success = action.execute();

        if (success) {
            this._logAction(action);

            if (action.isDone) {
                if (action.type !== ActionTypes.MOVE_ACTION) {
                    this.isActionDone = true;
                }

                this._nextPhase();
            }
        }

        this._actions.next();
    }

    _nextPhase() {
        this.currentPhase = this._phases.next();

        if (!this.currentPhase) {
            this.isDone = true;
        }
    }

    _logAction(action) {
        switch (action.type) {
        case ActionTypes.MOVE_ACTION:
            {
                const lastPoint = action.path[action.path.length - 1];
                console.log(`${action.actor.name} is moving to ${lastPoint}. Movement left: ${action.actor.movementPoints}`);
                break;
            }
        case ActionTypes.ATTACK_ACTION:
            console.log(`${action.attacker.name} is attacking ${action.defender.name}`);
            break;
        case ActionTypes.END_ACTION_ACTION:
            console.log(`${action.actor.name} is ending phase ${this.currentPhase.toString()}`);
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