import {Signal} from 'phaser';
import MoveCommand from 'commands/movecommand';

export default class MovementStrategy {
    /**
     * @constructor
     * @param       {Phaser.Game} game Game instance
     * @param       {Actor} actor Actor to perform the movement
     * @param       {number} movementPoints Points available for moving
     * @param       {Phaser.TileMap} map Current tilemap instance
     * @param       {Array} allActors All actors on the map
     * @return      {MovementStrategy}
     */
    constructor(turn) {
        this.turn = turn;
        this.game = turn.game;
        this.actor = turn.actor;
        this.map = turn.map;
        this.allActors = turn.allActors;

        this.pathFinder = this.game.pathFinder;
        this.moveDone = new Signal();
    }

    /**
     * Dispatch move command
     * @param  {Array} path An array of Point objects
     * @param  {boolean} [isMovementFinished = false] Should the movement phase be ended after this move command
     * @return {undefined}
     */
    dispatchCommand(path, isMovementFinished = false) {
        const command = new MoveCommand({ actor: this.actor, path, isMovementFinished });
        this.moveDone.dispatch(command);
    }

    /**
     * Remove event listeners
     * @return {undefined}
     */
    dispose() {
        this.moveDone.dispose();
    }
}