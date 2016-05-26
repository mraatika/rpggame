import {Point} from 'phaser';
import {chain} from 'lodash';
import MapUtils from 'common/maputils';
import MovementStrategy from 'movement/movementstrategy';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * @class AttackMovementStrategy
 * @description Attack movement strategy for NPC character
 * @extends MovementStrategy
 */
export default class AttackMovementStrategy extends MovementStrategy {

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.Sprite} actor
     * @param       {number} movementPoints
     * @param       {Phaser.TileMap} map
     * @param       {Array} allActors
     * @return      {AttackMovementStrategy}
     */
    constructor(action, target) {
        super(action);
        this.target = target;
        this.shouldRecalculatePath = false;
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
        const targetPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.target.x, this.target.y), gameConfig.map.tileSize);
        const endPoint = this._selectClosestAttackingPosition(actorPosition, targetPosition);
        const maxDistance = this.action.movementPoints;

        console.log('MOVEMENT POINTS:', maxDistance, `ATTACKING TO: ${endPoint.x},${endPoint.y}`);

        if (!MapUtils.isWalkable(this.map, endPoint, this.allActors)) {
            this._path = [];
            return;
        }

        // endpoint is false if it's occupied or the tile is a blocking tile
        this.game.pathFinder.findPath(actorPosition, endPoint, path => {
            // move as far as possible
            path = path.slice(1, maxDistance + 1);

            // ignore the available moving points. Just move as far as possible.
            if (!MapUtils.isValidPath(path, Infinity)) {
                // if the path is invalid select a new point to move to
                this.calculatePath(actorPosition, targetPosition, maxDistance);
                return;
            }

            this._path.add(...path);
        });
    }

    _selectClosestAttackingPosition(actorPosition, targetPosition) {
        const surroundingTiles = MapUtils.getSurroundingTiles(targetPosition);

        return chain(surroundingTiles)
            .compact()
            .filter(tile => MapUtils.isWalkable(this.map, tile, this.allActors))
            .minBy(tile => {
                return this.game.physics.arcade.distanceBetween(actorPosition, tile);
            })
            .value();

    }
}