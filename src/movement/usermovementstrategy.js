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
    constructor(turn) {
        super(turn);

        this.game.input.onDown.add(this._onPointerClick, this);

        console.log('MOVEMENT POINTS:', this.turn.movementPoints);
    }

    dispose() {
        super.dispose();
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
            // check if the path is no longer than available movement points
            if (!MapUtils.isValidPath(path, this.turn.movementPoints, this.allActors)) return;
            // send the move command if path is valid
            this.dispatchCommand(path);
        });
    }
}