import { values } from 'lodash';
import EventDispatcher from './eventdispatcher';
import eventTypes from './eventtypes';

/**
 * @class GameEvent
 * @description Base class for all events
 */
export default class GameEvent {

    /**
     * @constructor
     * @param       {EventType} type Type of the event
     * @param       {object} [props={}]
     * @return      {GameEvent}
     */
    constructor(type, props = {}) {
        if (!type) {
            throw new Error('InvalidArgumentsException: Type is missing!');
        }

        if (values(eventTypes).indexOf(type) === -1) {
            throw new Error('InvalidArgumentsException: Unknown event type!');
        }

        this.type = type;

        Object.assign(this, props);
    }

    /**
     * Dispatch this event via EventDispatcher
     */
    dispatch() {
        EventDispatcher.dispatch(this);
    }
}
