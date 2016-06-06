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
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    calculatePath() {
        const actorPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.actor.x, this.actor.y), gameConfig.map.tileSize);
        const targetPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.actor.target.x, this.actor.target.y), gameConfig.map.tileSize);
        const endPoint = this._selectClosestAttackingPosition(actorPosition, targetPosition);
        let path = [];

        if (!endPoint) {
            this.isMovementFinished = true;
            return [];
        }

        // endpoint is false if it's occupied or the tile is a blocking tile
        this.game.pathFinder.findPath(actorPosition, endPoint, _path => {
            // move as far as possible
            path = _path.slice(0, 2);
        });

        return path;
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