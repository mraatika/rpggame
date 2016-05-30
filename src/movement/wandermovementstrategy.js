import {filter} from 'lodash';
import MapUtils from 'common/maputils';
import MovementStrategy from 'movement/movementstrategy';

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
        const actorPosition =  MapUtils.getTilePositionByCoordinates(this.actor.position);
        const point = this._selectRandomPoint(actorPosition, MapUtils.getTilePositionByCoordinates(this.actor.previousPosition));

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
    _selectRandomPoint(currentPosition, prevPosition) {
        // get all available directions
        const directions = filter(MapUtils.getSurroundingTiles(currentPosition), tile => {
            return tile &&
                MapUtils.isWalkable(this.map, tile, this.allActors) &&
                !MapUtils.isSameTile(tile, prevPosition);
        });

        // select random direction
        return this.game.rnd.pick(directions);
    }
}