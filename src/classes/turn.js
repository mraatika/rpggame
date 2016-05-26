import {Queue} from 'datastructures';
import Actor from 'sprites/actor';
import PlayerMovementAction from 'movement/playermovementaction';
import AIMovementAction from 'movement/aimovementaction';

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

        this._actions = new Queue(
            this._getMoveAction()
        );
    }

    start() {
        this._nextPhase();
    }

    update() {
        if (!this._currentAction || this._currentAction.isLocked) {
            return;
        }

        if (this._currentAction.isDone) {
            this._nextPhase();
            return;
        }

        this._currentAction.execute();
    }

    dispose() {
        if (this._currentAction) this._currentAction.dispose();
    }

    _nextPhase() {
        if (this._currentAction) {
            this._currentAction.dispose();
        }

        this._currentAction = this._actions.next();

        // if all phases are done then turn is done
        if (!this._currentAction) {
            this._onTurnDone();
            return;
        }
    }

    _getMoveAction() {
        return this.actor.isPlayerControlled ? new PlayerMovementAction(this) : new AIMovementAction(this);
    }

    /**
     * Dispatch turnDone event and clean up event listers etc.
     * @private
     * @return  {undefined}
     */
    _onTurnDone() {
        this.dispose();
        this.isDone = true;
    }
}