import {Point} from 'phaser';
import {filter} from 'lodash';
import MapUtils from 'common/maputils';
import MovementStrategy from 'movement/movementstrategy';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * @class WanderMovementStrategy
 * @description Random movement strategy for NPC character
 * @extends MovementStrategy
 */
export default class WanderMovementStrategy extends MovementStrategy {

    /**
     * Wander stategy moves tile at a time so it can be changed
     * between moves if need be
     * @return {Array} An array containing a single point
     */
    get path() {
        return [this._path.next()];
    }

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.Sprite} actor
     * @param       {Phaser.TileMap} map
     * @param       {Array} allActors
     * @return      {WanderMovementStrategy}
     */
    constructor(action) {
        super(action);
        this.calculatePath();
    }

    /**
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    calculatePath() {
        const actorPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.actor.x, this.actor.y), gameConfig.map.tileSize);
        const maxDistance = this.action.movementPoints;
        const path = this._selectRandomPath(actorPosition, maxDistance);

        console.log(`MOVEMENT POINTS: ${maxDistance}, WANDERING TO:, ${path[path.length - 1].x}, ${path[path.length - 1].x}`);

        this._path.add(...path.slice(1));
    }

    /**
     * Selects a path of random points. Calls itself recursively until all movement points are used
     * @private
     * @param   {Phaser.Point} prevPosition Initial/previous point
     * @param   {number} movementPoints Available movement points
     * @param   {Array} path The calculated path
     * @return  {Array} The calculated path
     */
    _selectRandomPath(prevPosition, movementPoints, path = []) {
        path.push(prevPosition);

        // if out of movement points the path is done
        if (!movementPoints) return path;

        // get all available directions
        const directions = filter(MapUtils.getSurroundingTiles(prevPosition), tile => {
            return tile && MapUtils.isWalkable(this.map, tile, this.allActors) && !MapUtils.isSameTile(tile, path[path.length - 1]);
        });
        // select random direction
        const direction = this.game.rnd.pick(directions);

        return this._selectRandomPath(direction, --movementPoints, path);
    }
}