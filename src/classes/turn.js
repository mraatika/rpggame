import {Signal} from 'phaser';
import {Queue} from 'datastructures';
import {toArray} from 'lodash';
import Mover from 'movement/mover';
import Actor from 'sprites/actor';
import CommandTypes from 'commands/commandtypes';
import MapUtils from 'common/maputils';

/**
 * @class Turn
 * @description A class representing a single turn in the game
 */
export default class Turn {

    /**
     * Getter for phases queue
     * @return {Queue}
     */
    get phases() {
        return this._phases;
    }

    get movementPoints() {
        return this._movementPoints;
    }

    get currentPhase() {
        return this._currentPhase;
    }

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

        this._turnLocked = false;

        this._mover = new Mover(game, actor);
        this._phases = new Queue(...toArray(Turn.Phases));

        this.turnDone = new Signal();
    }

    /**
     * Start executing this turn
     * @return {undefined}
     */
    start() {
        this._startPhase(this._phases.next());
    }

    dispose() {
        if (this.movementStrategy) this.movementStrategy.dispose();
        this.turnDone.dispose();
    }

    /**
     * Start exectuting the next phase of this turn
     * @private
     * @param   {[type]} phase [description]
     * @return  {[type]}
     */
    _startPhase(phase) {
        // if all phases are done then turn is done
        if (!phase) {
            this._onTurnDone();
            return;
        }

        this._currentPhase = phase;

        switch(phase) {
        case Turn.Phases.PHASE_MOVE:
            this._startMovePhase();
            break;
        case Turn.Phases.PHASE_ACTION:
            this._startActionPhase();
            break;
        case Turn.Phases.PHASE_END_ACTION:
            this._onTurnDone();
        }
    }

    _startMovePhase() {
        this._movementPoints = this.actor.throwMovement();
        this._selectMovementStrategyAndContinue();
    }

    _startActionPhase() {
        //this.actor.onAction.add(this._handleCommand, this);
        this._onPhaseDone();
    }


    _selectMovementStrategyAndContinue() {
        const movementStrategyFactory = this.actor.getMovementStrategy(this.allActors);
        this.movementStrategy = movementStrategyFactory(this);
        this.movementStrategy.moveDone.add(this._handleCommand.bind(this));
    }

    _handleCommand(command) {
        switch (command.type) {
        case CommandTypes.MOVE_COMMAND:
            this._move(command.props.path, command.props.isMovementFinished);
            break;
        case CommandTypes.ATTACK_COMMAND:
            break;
        case CommandTypes.LOOT_COMMAND:
            break;
        }
    }

    /**
     * Move the actor along a path
     * @private
     * @param   {Array} path An array of Phaser.Point objects
     * @param   {Boolean} isMovementFinished Should the move phase be ended after moving
     * @return  {undefined}
     */
    _move(path, isMovementFinished) {
        // prevent move action when an action is being performed or
        // it's not time for moving
        if (this._currentPhase !== Turn.Phases.PHASE_MOVE) {
            console.error('Wrong state: Movement not allowed!');
            return;
        }

        if (this._turnLocked) return;

        // check that the amount of movement points is sufficient
        if (this._movementPoints - path.length + 1 < 0) {
            console.error(`Not enough movement points available for path. (Available: ${this._movementPoints}, needed: ${path.length - 1})`);
            return;
        }

        // reduce movement points (reduce one from path length since it's the starting point)
        this._movementPoints -= (path.length - 1);

        this._turnLocked = true;

        console.log('Movement points left:', this._movementPoints);

        this._markEndPoint(path[path.length - 1]);

        // move the actor to given point
        this._mover.moveTo(path, () => {
            this._turnLocked = false;
            this._clearEndPointMarker();

            if (isMovementFinished || this._movementPoints === 0) {
                this._onMovePhaseFinished();
            }
        });
    }

    /**
     * Clean up movement phase event listeners etc.
     * @private
     * @return  {undefined}
     */
    _onMovePhaseFinished() {
        //this.movementStrategy.moveDone.remove(this._handleCommand, this);
        this.movementStrategy.dispose();
        this._onPhaseDone();
    }

    /**
     * Start next phase
     * @private
     * @return  {undefined}
     */
    _onPhaseDone() {
        this._startPhase(this._phases.next());
    }

    /**
     * Dispatch turnDone event and clean up event listers etc.
     * @private
     * @return  {undefined}
     */
    _onTurnDone() {
        this.turnDone.dispatch();
        this.dispose();
    }

    /**
     * Draw a marker to display the movement end point
     * @private
     * @param   {Phaser.Point} endPoint
     * @return  {undefined}
     */
    _markEndPoint(endPoint) {
        const g = this.game.add.graphics(
            MapUtils.getTileCoordinateByTileIndex(endPoint.x),
            MapUtils.getTileCoordinateByTileIndex(endPoint.y)
        );

        // draw a circle
        g.lineStyle(0);
        g.beginFill(0xFFFF0B, 0.5);
        g.drawCircle(0, 0, 10);
        g.endFill();

        this._endPointMarker = g;
    }

    /**
     * Remove the end point marker
     * @private
     * @return  {undefined}
     */
    _clearEndPointMarker() {
        if (this._endPointMarker) {
            this._endPointMarker.destroy();
        }
    }
}

/**
 * All the phases of a single turn
 * @type {Object}
 */
Turn.Phases = {
    PHASE_MOVE: Symbol('PHASE_MOVE'),
    PHASE_ACTION: Symbol('PHASE_ACTION')/*,
    PHASE_END_ACTION: Symbol()*/
};