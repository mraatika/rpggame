import MovementStrategy from './movementstrategy';
import { getTilePositionByCoordinates, isWalkable, getAreaOfRadius } from '../utils/maputils';

/**
 * Select a random surrounding tile to move to which is not actors previous position
 * @private
 * @param   {Phaser.Point} currentPosition
 * @param   {Phaser.Point} prevPosition
 * @return  {Phaser.Point}
 */
function selectRandomPoint(actorPosition) {
    const maxDistance = this.actor.movementPoints;
    const area = getAreaOfRadius(actorPosition, maxDistance);
    const walkables = area.filter(tile => isWalkable(this.map, tile, this.allActors));

    return walkables.length ? this.game.rnd.pick(walkables) : null;
}

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
        const endPoint = selectRandomPoint.call(this, actorPosition);
        let path = [];

        if (!endPoint) {
            this.isMovementFinished = true;
            return [];
        }

        this.game.pathFinder.findPath(actorPosition, endPoint, (calculatedPath = []) => {
            // move as far as possible
            path = calculatedPath.slice(0, this.actor.movementPoints + 1);
        });

        return path;
    }
}
