import {Point} from 'phaser';
import MapUtils from 'common/maputils';
import MovementStrategy from 'movement/movementstrategy';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * @class UserMovementStrategy
 * @description Movement strategy for player. Waits for user inputs
 * @extends MovementStrategy
 */
export default class UserMovementStrategy extends MovementStrategy {

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.Sprite} actor
     * @param       {Phaser.TileMap} map
     * @param       {Array} allActors
     * @return      {UserMovementStrategy}
     */
    constructor(action) {
        super(action);
        this.game.input.onDown.add(this._onPointerClick, this);
    }

    dispose() {
        super.dispose();
        this._clearEndPointMarker();
        this.game.input.onDown.remove(this._onPointerClick, this);
    }

    /**
     * Select a movement end point. Callback for mouse click.
     * @private
     * @return  {undefined}
     */
    _onPointerClick() {
        const pos = this.game.input.activePointer.position;
        const start = MapUtils.getTilePositionByCoordinates(new Point(this.actor.x, this.actor.y), gameConfig.map.tileSize);
        const endPoint = MapUtils.getTilePositionByCoordinates(new Point(pos.x, pos.y), gameConfig.map.tileSize);

        // endpoint is false if it's occupied or the tile is a blocking tile
        if (!MapUtils.isWalkable(this.map, endPoint, this.allActors)) return;

        // find path to an endpoint
        this.game.pathFinder.findPath(start, endPoint, path => {
            path = path.slice(1);
            // check if the path is no longer than available movement points
            if (!MapUtils.isValidPath(path, this.action.movementPoints, this.allActors)) return;
            // send the move command if path is valid
            this._path.add(...path);

            this._markEndPoint(this._path.peekLast());
        });
    }

    /**
     * Draw a marker to display the movement end point
     * @private
     * @param   {Phaser.Point} endPoint
     * @return  {undefined}
     */
    _markEndPoint(endPoint) {
        this._clearEndPointMarker();

        const g = this.game.add.graphics(
            MapUtils.getTileCoordinateByTileIndex(endPoint.x),
            MapUtils.getTileCoordinateByTileIndex(endPoint.y)
        );

        // draw a circle
        g.lineStyle(0);
        g.beginFill(0xFFFF0B, 0.5);
        g.drawCircle(0, 0, 10);
        g.endFill();

        this._endPointMarker = g;
    }

    /**
     * Remove the end point marker
     * @private
     * @return  {undefined}
     */
    _clearEndPointMarker() {
        if (this._endPointMarker) {
            this._endPointMarker.destroy();
        }
    }
}