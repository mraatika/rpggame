import { Signal } from 'phaser';
import eventTypes from '../constants/eventtypes';

const signal = new Signal();

/**
 * Dispatch an event via EventDispatcher
 * @description Base class for all events
 */
export function sendEvent(type, props = {}) {
    if (!type) {
        throw new Error('InvalidArgumentsException: Type is missing!');
    }

    if (!eventTypes[type]) {
        throw new Error('InvalidArgumentsException: Unknown event type!');
    }

    const event = { type, ...props };

    if (process.env.NODE_ENV === 'development') {
        console.log(`%c Event ${type}`, 'font-weight: bold; color: #35c4ba', event);
    }

    signal.dispatch(event);
}

/**
 * A signal that acts as an event dispatcher
 * @exports
 * @type {Phaser.Signal}
 */
export default signal;
