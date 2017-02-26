import GameEvent from './gameevent';
import EventTypes from '../constants/eventtypes';

/**
 * @exports
 * @class ItemEquippedEvent
 * @event Events#ItemEquippedEvent
 * @description An event fired after an item is equipped or unequipped
 * @extends {GameEvent}
 */
export default class ItemEquippedEvent extends GameEvent {
    /**
     * Creates an instance of ItemEquippedEvent.
     * @param {Item} item
     * @param {boolean} condition
     * @memberOf ItemEquippedEvent
     */
    constructor(item, condition) {
        super(EventTypes.ITEM_EQUIPPED_EVENT, { item, condition });
    }
}
