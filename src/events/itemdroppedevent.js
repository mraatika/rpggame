import GameEvent from './gameevent';
import EventTypes from '../constants/eventtypes';
import Events from './events';

/**
 * @exports
 * @class ItemDroppedEvent
 * @event Events#ItemDroppedEvent
 * @description An event fired after an item is dropped
 * @extends {GameEvent}
 */
export default class ItemDroppedEvent extends GameEvent {
    /**
     * Creates an instance of ItemDroppedEvent.
     * @param {Item|Item[]} item
     * @param {boolean} condition
     * @memberOf ItemDroppedEvent
     */
    constructor(item) {
        super(EventTypes.ITEM_DROPPED_EVENT, { item });
    }

    dispatch() {
        new Events.ItemEquippedEvent(this.item, false).dispatch();
        super.dispatch();
    }
}
