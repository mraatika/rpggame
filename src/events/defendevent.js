import GameEvent from './gameevent';
import EventTypes from '../constants/eventtypes';

/**
 * @class MoveEvent
 * @description An event of an actor defending against another actor
 * @extends {GameEvent}
 */
export default class DefendEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {number} defence The number of successes
     * @return      {DefendEvent}
     */
    constructor(actor, defence) {
        super(EventTypes.DEFEND_EVENT, { actor, defence });
    }
}
