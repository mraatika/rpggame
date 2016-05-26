import {Queue} from 'datastructures';
import Actor from 'sprites/actor';
import CommandEmitter from 'commands/commandemitter';
import CommandTypes from 'commands/commandtypes';
import ActionTypes from 'actions/actiontypes';

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
    constructor(game, map, actor, allActors) {

        if (!(actor instanceof Actor)) {
            throw new Error('InvalidArgumentsException: Actor invalid or missing!');
        }

        this.game = game;
        this.map = map;
        this.actor = actor;
        this.allActors = allActors;

        this.isDone = false;

        this._commandQueue = new Queue();

        this._actions = new Queue(
            this.actor.getMovementAction(this)
        );
    }

    start() {
        this._nextPhase();
        CommandEmitter.add(this._handleCommand, this);
    }

    update() {
        if (!this._currentAction) {
            return this.dispose();
        }

        if (this._currentAction.isDone) {
            return this._nextPhase();
        }

        const action = this._commandQueue.next();

        if (action) {
            this._currentAction.execute(action);
        } else {
            this._currentAction.decide();
        }
    }

    dispose() {
        if (this._currentAction) this._currentAction.dispose();
        CommandEmitter.remove(this._handleCommand, this);
        this.isDone = true;
    }

    _nextPhase() {
        if (this._currentAction) {
            this._currentAction.dispose();
        }

        this._currentAction = this._actions.next();
    }

    _handleCommand(command) {
        const actionType = this._currentAction.type;

        // if it's not the actors turn
        if (command.actor !== this.actor) {
            return;
        }

        if (command.type === CommandTypes.MOVE_COMMAND && actionType !== ActionTypes.MOVE_ACTION) {
            return;
        }

        if (command.type === CommandTypes.ATTACK_COMMAND && actionType !== ActionTypes.ATTACK_ACTION) {
            return;
        }

        this._commandQueue.add(command);
    }
}