import {Point} from 'phaser';
import {defer} from 'lodash';
import MapUtils from 'common/maputils';
import {NumberUtils} from 'utils/utils';
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
    constructor(turn) {
        super(turn);
        defer(this._startMoving.bind(this));
    }

    /**
     * Throw movement and randomly select a point to wander to
     * @private
     * @return  {undefined}
     */
    _startMoving() {
        const actorPosition =  MapUtils.getTilePositionByCoordinates(new Point(this.actor.x, this.actor.y), gameConfig.map.tileSize);
        this._moveToRandomPoint(actorPosition, this.actor.throwMovement());
    }

    /**
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    _moveToRandomPoint(actorPosition, maxDistance) {
        let endPoint;

        do {
            endPoint = this._selectRandomEndPoint(actorPosition, maxDistance);
        } while(!MapUtils.isWalkable(this.map, endPoint, this.allActors));

        console.log('MOVEMENT POINTS:', maxDistance, `SELECTED ENDPOINT: ${endPoint.x},${endPoint.y}`);

        // endpoint is false if it's occupied or the tile is a blocking tile
        this.game.pathFinder.findPath(actorPosition, endPoint, path => {
            if (!MapUtils.isValidPath(path, maxDistance)) {
                // if the path is invalid select a new point to move to
                this._moveToRandomPoint(actorPosition, maxDistance);
                return;
            }
            // send the command
            this.dispatchCommand(path, true);
        });
    }

    _selectRandomEndPoint(actorPosition, maxDistance) {
        const {x:actorX, y:actorY} = actorPosition;
        let movementPoints = maxDistance;
        let x, y;

        x = NumberUtils.betweenMaxMinusAndPlus(movementPoints);

        movementPoints -= Math.abs(x);

        y = NumberUtils.betweenMaxMinusAndPlus(movementPoints);

        return new Point(actorX + x, actorY + y);
    }
}