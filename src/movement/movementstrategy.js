import {Deque} from 'datastructures';

/**
 * @class MovementStrategy
 * @description Super class for all movement strategies
 */
export default class MovementStrategy {
    /**
     * @constructor
     * @param       {Action} action An action that initiated this strategy
     * @return      {MovementStrategy}
     */
    constructor(actor, turn) {

        this.turn = turn;
        this.actor = actor;

        this.game = turn.state.game;
        this.map = turn.state.map;
        this.allActors = turn.allActors;

        this._path = new Deque();

        this.pathFinder = this.game.pathFinder;
    }

    /**
     * Calculate a movement path. By default returns
     * an empty array. If actual functionality is desired
     * should be overwritten in the inheriting class
     * @return {Phaser.Point[]}
     */
    calculatePath() { return []; }

    /**
     * Clean up method. Placeholder, should
     * be implemented in the inheriting class
     * @return {undefined}
     */
    dispose() {}

    /**
     * Called when movement starts. Placeholder, should
     * be implemented in the inheriting class
     * @return {undefined}
     */
    onMoveStart() {}

    /**
     * Called after the movement is done. Placeholder, should
     * be implemented in the inheriting class
     * @return {undefined}
     */
    onMoveEnd() {}
}