import MapUtils from 'common/maputils';
import gameConfig from 'json!assets/config/gameconfig.json';
import {Queue} from 'datastructures';

/**
 * @class Mover
 * @description Manager class for moving a sprite object along given path
 */
export default class Mover {
    constructor(game, actor) {
        this.actor = actor;
        this.game = game;
        this._path = new Queue();
    }

    /**
     * Move actor along the given path
     * @param  {array} path An array of Point objects with tile x and y coordinates
     * @param {Function} [callback] Callback to call after movement is done
     */
    moveTo(path, callback) {
        this._callback = callback || function() {};
        if (!(path || []).length)  path = [];

        // do nothing if endPoint is actor's current tile or unwalkable
            // reverse the array so the items can be pop'd from it
        this._path.add(...path.slice(1));
        this._moveToNextPoint(this._path.next());
    }

    /**
     * Move actor to the next point in the path queue. Calls itself recursively
     * until the queue is empty
     * @private
     */
    _moveToNextPoint(point) {
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
            .onComplete.add(() => this._moveToNextPoint(this._path.next()), this);
    }

    _onMovementDone() {
        this._callback.call(null);
    }
}