import {Point} from 'phaser';
import {chain, defer} from 'lodash';
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
    constructor(turn, target) {
        super(turn);
        this.target = target;
        defer(this._startMoving.bind(this));
    }

    /**
     * Throw movement and randomly select a point to wander to
     * @private
     * @return  {undefined}
     */
    _startMoving() {
        const actorPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.actor.x, this.actor.y), gameConfig.map.tileSize);
        const targetPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.target.x, this.target.y), gameConfig.map.tileSize);
        this._moveTowardsPrey(actorPosition, targetPosition, this.actor.throwMovement());
    }

    /**
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    _moveTowardsPrey(actorPosition, targetPosition, maxDistance) {
        const endPoint = this._selectClosestAttackingPosition(actorPosition, targetPosition);

        console.log('MOVEMENT POINTS:', maxDistance, `SELECTED ENDPOINT: ${endPoint.x},${endPoint.y}`);

        if (!MapUtils.isWalkable(this.map, endPoint, this.allActors)) {
            this.dispatchCommand([]);
            return;
        }

        // endpoint is false if it's occupied or the tile is a blocking tile
        this.game.pathFinder.findPath(actorPosition, endPoint, path => {
            // move as far as possible
            path = path.slice(0, maxDistance + 1);

            // ignore the available moving points. Just move as far as possible.
            if (!MapUtils.isValidPath(path, Infinity)) {
                // if the path is invalid select a new point to move to
                this._moveTowardsPrey(actorPosition, targetPosition, maxDistance);
                return;
            }

            this.dispatchCommand(path, true);
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