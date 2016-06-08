import GameEvent from 'events/gameevent';
import EventTypes from 'events/eventtypes';

/**
 * @class LootEvent
 * @description An event of an actor looting a treasure
 * @extends {GameEvent}
 */
export default class LootEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {Treasure} treasure
     * @param       {object} loot
     *                  {number} gold The amount of gold looted
     *                  {Array} items The looted items
     * @return      {LootEvent}
     */
    constructor(actor, treasure, loot) {
        super(EventTypes.LOOT_EVENT, { actor, treasure, loot });
    }
}