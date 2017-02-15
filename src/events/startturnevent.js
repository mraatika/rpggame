import GameEvent from './gameevent';
import EventTypes from '../constants/eventtypes';

/**
 * @class StartTurnEvent
 * @description An event of an actor starting a turn
 * @extends {GameEvent}
 */
export default class StartTurnEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @return      {StartTurnEvent}
     */
    constructor(actor) {
        super(EventTypes.START_TURN_EVENT, { actor });
    }
}
