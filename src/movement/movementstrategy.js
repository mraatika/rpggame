import {Deque} from 'datastructures';

/**
 * @class MovementStrategy
 * @description Super class for all movement strategies
 */
export default class MovementStrategy {

    /**
     * Return the calculated path (if has one)
     * and empties the path afterwards
     * @return {Array} An array of points
     */
    get path() {
        if (!this._path.size()) return [];
        const path = this._path.container.slice();
        this._path.empty();
        return path;
    }

    /**
     * @constructor
     * @param       {Action} action An action that initiated this strategy
     * @return      {MovementStrategy}
     */
    constructor(action) {
        const turn = action.turn;

        this.turn = turn;
        this.action = action;
        this.game = turn.game;
        this.actor = turn.actor;
        this.map = turn.map;
        this.allActors = turn.allActors;

        this._path = new Deque();
        this._path.limit(action.movementPoints);

        this.pathFinder = this.game.pathFinder;
    }

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