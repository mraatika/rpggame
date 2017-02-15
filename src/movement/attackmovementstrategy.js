import { Point } from 'phaser';
import MapUtils from '../utils/maputils';
import MovementStrategy from './movementstrategy';
import gameConfig from '../config/gameconfig.json';

function selectClosestAttackingPosition(actorPosition, targetPosition) {
    const surroundingTiles = MapUtils.getSurroundingTiles(targetPosition);
    const nonEmptyTiles = surroundingTiles
        .filter(tile => !!tile);
    const walkable = nonEmptyTiles
        .filter(tile => MapUtils.isWalkable(this.map, tile, this.allActors));

    return walkable.reduce((memo, tile) => {
        const memoDistance = this.game.physics.arcade.distanceBetween(actorPosition, memo);
        const distance = this.game.physics.arcade.distanceBetween(actorPosition, tile);
        return memoDistance < distance ? memo : tile;
    });
}

/**
 * @class AttackMovementStrategy
 * @description Attack movement strategy for NPC character
 * @extends {MovementStrategy}
 */
export default class AttackMovementStrategy extends MovementStrategy {
    /**
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    calculatePath() {
        const actorPosition = MapUtils.getTilePositionByCoordinates(
            new Point(this.actor.x, this.actor.y),
            gameConfig.map.tileSize,
        );
        const targetPosition = MapUtils.getTilePositionByCoordinates(
            new Point(this.actor.target.x, this.actor.target.y),
            gameConfig.map.tileSize,
        );
        const endPoint = selectClosestAttackingPosition.call(this, actorPosition, targetPosition);
        let path = [];

        if (!endPoint) {
            this.isMovementFinished = true;
            return [];
        }

        // endpoint is false if it's occupied or the tile is a blocking tile
        this.game.pathFinder.findPath(actorPosition, endPoint, (_path) => {
            // move as far as possible
            path = (_path || []).slice(0, 2);
        });

        return path;
    }
}
