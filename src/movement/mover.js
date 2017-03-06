import { Queue } from 'datastructures';
import { getCoordinatePositionByTile } from '../utils/maputils';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';

/**
 * @name Mover
 * Manager for moving a sprite object along given path
 * @exports
 * @param {Phaser.Game} game
 * @param {ActorSprite} actor
 * @returns {Mover}
 */
export default function mover(game, actor) {
    const pathQueue = new Queue();
    let callback;

    /**
     * Move actor to a tile. Calls itself recursively until the path queue is empty
     * @private
     * @param   {Phaser.Point} tile
     * @memberOf Mover
     */
    function moveToTile(tile) {
        // if the path queue is empty we have reached the goal
        if (!tile) {
            callback.call(null);
            return;
        }

        // pixel coordinates of the move target tile
        const XYCoordinates = getCoordinatePositionByTile(tile);

        game.add.tween(actor)
            .to({ x: XYCoordinates.x, y: XYCoordinates.y }, 400, null, true, 75)
            .start()
            .onComplete.add(() => {
                sendEvent(EventTypes.MOVE_EVENT, { actor, tile });
                moveToTile(pathQueue.next());
            });
    }

    const methods = {
        /**
         * Move actor along a path of points
         * @param   {Phaser.Point[]} path
         * @param   {Function} callback
         * @memberOf Mover
         */
        movePath(path = [], fn = () => {}) {
            callback = fn;

            // if the path queue is empty we have reached the goal
            if (!(path || []).length) {
                callback.call(null);
                return;
            }

            pathQueue.add(...path);

            moveToTile(pathQueue.next());
        },
    };

    return Object.assign(
        {},
        methods,
    );
}
