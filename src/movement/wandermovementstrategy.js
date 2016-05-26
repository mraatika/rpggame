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
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.Sprite} actor
     * @param       {Phaser.TileMap} map
     * @param       {Array} allActors
     * @return      {WanderMovementStrategy}
     */
    constructor(action) {
        super(action);
        this.shouldRecalculatePath = true;
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

        this._path.add(...path);
    }

    _selectRandomPath(prevPosition, movementPoints, path = []) {
        if (!movementPoints) return path;

        const directions = filter(MapUtils.getSurroundingTiles(prevPosition), tile => {
            return tile && MapUtils.isWalkable(this.map, tile, this.allActors) && !MapUtils.isSameTile(tile, prevPosition);
        });
        const direction = this.game.rnd.pick(directions);

        path.push(direction);

        return this._selectRandomPath(direction, --movementPoints, path);
    }
}