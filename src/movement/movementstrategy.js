import {Deque} from 'datastructures';

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

    dispose() {}

    getNextPoint() {
        return this._path.next();
    }
}