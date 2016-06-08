import GameEvent from 'events/gameevent';
import EventTypes from 'events/eventtypes';

/**
 * @class MoveEvent
 * @description An event of an actor moving to a tile
 * @extends {GameEvent}
 */
export default class MoveEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {Phaser.Point} tile
     * @return      {MoveEvent}
     */
    constructor(actor, tile) {
        super(EventTypes.MOVE_EVENT, { actor, tile });
    }
}