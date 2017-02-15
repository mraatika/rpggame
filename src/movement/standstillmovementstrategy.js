import MovementStrategy from './movementstrategy';

/**
 * @class StandStillMovementStrategy
 * @description Movement strategy that does nothing but ends movement
 * @extends MovementStrategy
 */
export default class StandStillMovementStrategy extends MovementStrategy {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {Turn} turn
     * @return      {StandStillMovementStrategy}
     */
    constructor(...params) {
        super(...params);
        this.isMovementFinished = true;
    }
}
