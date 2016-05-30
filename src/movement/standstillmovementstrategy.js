import MovementStrategy from 'movement/movementstrategy';

/**
 * @class StandStillMovementStrategy
 * @description Movement strategy that does nothing
 * @extends MovementStrategy
 */
export default class StandStillMovementStrategy extends MovementStrategy {

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.Sprite} actor
     * @param       {Phaser.TileMap} map
     * @param       {Array} allActors
     * @return      {StandStillMovementStrategy}
     */
    constructor(...params) {
        super(...params);
        this.isMovementFinished = true;
    }
}