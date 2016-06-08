import {extend, toArray} from 'lodash';
import EventDispatcher from 'events/eventdispatcher';
import EventTypes from 'events/eventtypes';

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

        if (toArray(EventTypes).indexOf(type) === -1) {
            throw new Error('InvalidArgumentsException: Unknown event type!');
        }

        this.type = type;

        extend(this, props);
    }

    /**
     * Dispatch this event via EventDispatcher
     */
    dispatch() {
        EventDispatcher.dispatch(this);
    }
}