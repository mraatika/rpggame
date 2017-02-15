import { Signal } from 'phaser';
import GameEvent from './gameevent';

/**
 * @class EventDispatcher
 * @description A singleton dispatcher for events
 * @extends {Signal}
 * @singleton
 */
class EventDispatcher extends Signal {
    /**
     * @constructor
     * @param       {GameEvent}
     * @return      {EventDispatcher}
     */
    dispatch(event) {
        if (!(event instanceof GameEvent)) {
            throw new Error('InvalidArgumentsException: Event missing or invalid!');
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`%c Event ${event.type}`, 'font-weight: bold; color: #35c4ba', event);
        }

        super.dispatch(event);
    }
}

export default new EventDispatcher();
