import MapUtils from 'common/maputils';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * @class Mover
 * @description Manager class for moving a sprite object along given path
 */
export default class Mover {
    constructor(game, actor) {
        this.actor = actor;
        this.game = game;
    }

    /**
     * Move actor along the given path
     * @param  {array} path An array of Point objects with tile x and y coordinates
     * @param {Function} [callback] Callback to call after movement is done
     */
    moveTo(point, callback) {
        this._callback = callback || function() {};
        if (!point) return;

        // do nothing if endPoint is actor's current tile or unwalkable
            // reverse the array so the items can be pop'd from it
        this._moveToPoint(point);
    }

    /**
     * Move actor to the next point in the path queue. Calls itself recursively
     * until the queue is empty
     * @private
     */
    _moveToPoint(point) {
        // if the path queue is empty we have reached the goal
        if (!point) {
            this._onMovementDone();
            return;
        }

        // pixel coordinates of the move target tile
        const XYCoordinates = MapUtils.getCoordinatePositionByTile(point, gameConfig.map.tileSize);

        this.game.add.tween(this.actor)
            .to({ x: XYCoordinates.x, y: XYCoordinates.y}, 500)
            .start()
            .onComplete.add(this._onMovementDone, this);
    }

    _onMovementDone() {
        this._callback.call(null);
    }
}