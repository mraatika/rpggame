import MovementStrategy from './movementstrategy';
import { getTilePositionByCoordinates, getSurroundingTiles, isWalkable, isSameTile } from '../utils/maputils';

/**
 * @class WanderMovementStrategy
 * @description Random movement strategy for NPC character
 * @extends MovementStrategy
 */
export default class WanderMovementStrategy extends MovementStrategy {
    /**
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    calculatePath() {
        const actorPosition = getTilePositionByCoordinates(this.actor.position);
        const point = this.selectRandomPoint(
            actorPosition,
            getTilePositionByCoordinates(this.actor.previousPosition),
        );

        if (!point) {
            this.isMovementFinished = true;
            return [];
        }

        return [actorPosition, point];
    }

    /**
     * Select a random surrounding tile to move to which is not actors previous position
     * @private
     * @param   {Phaser.Point} currentPosition
     * @param   {Phaser.Point} prevPosition
     * @return  {Phaser.Point}
     */
    selectRandomPoint(currentPosition, prevPosition) {
        // get all available directions
        const surroundings = getSurroundingTiles(currentPosition);
        const directions = surroundings.filter((tile) => {
            if (!tile) return false;
            if (!isWalkable(this.map, tile, this.allActors)) return false;
            if (isSameTile(tile, prevPosition)) return false;
            return true;
        });
        // select random direction
        return this.game.rnd.pick(directions);
    }
}
