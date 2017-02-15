import GameEvent from './gameevent';
import EventTypes from './eventtypes';

/**
 * @class EndTurnEvent
 * @description An event of an actor ending a turn
 * @extends {GameEvent}
 */
export default class EndTurnEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @return      {EndTurnEvent}
     */
    constructor(actor) {
        super(EventTypes.END_TURN_EVENT, { actor });
    }
}
