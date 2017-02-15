import { Queue } from 'datastructures';
import MapUtils from '../common/maputils';
import gameConfig from '../config/gameconfig.json';
import Events from '../events/events';

/**
 * Move actor to a tile. Calls itself recursively until the path queue is empty
 * @private
 * @param   {Phaser.Point} tile
 * @return  {undefined}
 */
function moveToTile(tile) {
    // if the path queue is empty we have reached the goal
    if (!tile) {
        this.callback.call(null);
        return;
    }

    // pixel coordinates of the move target tile
    const XYCoordinates = MapUtils.getCoordinatePositionByTile(tile, gameConfig.map.tileSize);

    this.game.add.tween(this.actor)
        .to({ x: XYCoordinates.x, y: XYCoordinates.y }, 400, null, true, 75)
        .start()
        .onComplete.add(() => {
            new Events.MoveEvent(this.actor, tile).dispatch();
            moveToTile.call(this, this.path.next());
        });
}

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
        this.path = new Queue();
    }

    /**
     * Move actor along a path of points
     * @param   {Phaser.Point[]} path
     * @param   {Function} callback
     * @returns {undefined}
     */
    movePath(path = [], callback = () => {}) {
        this.callback = callback;

        // if the path queue is empty we have reached the goal
        if (!(path || []).length) {
            this.callback.call(null);
            return;
        }

        this.path.add(...path);

        moveToTile.call(this, this.path.next());
    }
}
