import GameEvent from './gameevent';
import EventTypes from './eventtypes';

/**
 * @class LogEvent
 * @description An event with purpose of displaying a text on the
 *              game log.
 * @extends {GameEvent}
 */
export default class LogEvent extends GameEvent {

    /**
     * @constructor
     * @param       {string} text Text to be logged
     * @return      {LogEvent}
     */
    constructor(text) {
        super(EventTypes.LOG_EVENT, { text });
    }
}
