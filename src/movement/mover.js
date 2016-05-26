import {Queue} from 'datastructures';
import MapUtils from 'common/maputils';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * @class Mover
 * @description Manager class for moving a sprite object along given path
 */
export default class Mover {
    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.Sprite} actor
     * @return      {Mover}
     */
    constructor(game, actor) {
        this.actor = actor;
        this.game = game;
        this._path = new Queue();
    }

    /**
     * Move actor along a path of points
     * @param   {Phaser.Point[]} path
     * @param   {Function} callback
     * @returns {undefined}
     */
    movePath(path, callback) {
        this._callback = callback || function() {};

        // if the path queue is empty we have reached the goal
        if (!(path || []).length) {
            this._onMovementDone();
            return;
        }

        this._path.add(...path);

        this._moveToTile(this._path.next());
    }

    /**
     * Move actor to a tile. Calls itself recursively until the path queue is empty
     * @private
     * @param   {Phaser.Point} tile
     * @return  {undefined}
     */
    _moveToTile(tile) {
        // if the path queue is empty we have reached the goal
        if (!tile) {
            this._onMovementDone();
            return;
        }

        // pixel coordinates of the move target tile
        const XYCoordinates = MapUtils.getCoordinatePositionByTile(tile, gameConfig.map.tileSize);

        this.game.add.tween(this.actor)
            .to({ x: XYCoordinates.x, y: XYCoordinates.y}, 500)
            .start()
            .onComplete.add(() => this._moveToTile(this._path.next()));
    }

    /**
     * Callback to be called after the path queue is empty
     * @private
     * @return  {undefined}
     */
    _onMovementDone() {
        this._callback.call(null);
    }
}