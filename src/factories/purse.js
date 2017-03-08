import { without } from 'lodash';
import gameConfig from '../config/gameconfig.json';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';

/**
 * Factory function for creating a Purse object that acts
 * as a container for characters items.
 * @name Purse
 * @param {number} [size=gameConfig.player.purse.size]
 * @returns {Purse}
 */
export default function createPurse(size = gameConfig.player.purse.size) {
    let itemsInPurse = [];

    /**
     * Fill empty item slots with an item of corresponding group
     * @param {Purse} purse
     * @param {Item[]} addedItems
     */
    function fillUnequippedSlots(purse, addedItems = []) {
        addedItems.forEach((item) => {
            if (!purse.getEquippedItemOfGroup(item.itemGroup)) {
                purse.equipItem(item);
            }
        });
    }

    return Object.create({
        /**
         * Amount of gold in purse
         * @type {number}
         */
        gold: 0,

        /**
         * The size of the purse (how many items it can hold)
         * @type {number}
         */
        size,

        /**
         * Get copy of purse items
         * @memberOf Purse
         * @returns {Item[]}
         */
        getItems() {
            return [...itemsInPurse];
        },

        /**
         * Add item or items to this purse if they fit. Drops all
         * items that won't fit.
         * @memberOf Purse
         * @param {Item|Item[]} item
         * @fires Events#ItemDroppedEvent
         */
        add(items = []) {
            const addedItems = [].concat(items);
            const availableSpace = this.size - itemsInPurse.length;

            if (addedItems.length > availableSpace) {
                // remove items that won't fit from added items array
                const leftOut = addedItems.splice(availableSpace);
                sendEvent(EventTypes.ITEM_DROPPED_EVENT, { item: leftOut });
            }

            // add all items that fit purse
            itemsInPurse = itemsInPurse.concat(addedItems);

            // fill all unequipped item slots
            fillUnequippedSlots(this, addedItems);
        },

        /**
         * Equip an item
         * @memberOf Purse
         * @param  {Item} item
         */
        equipItem(item) {
            const group = item.itemGroup;

            // unequip other items from the same group (should actually only be one)
            this.getEquippedItems().forEach((i) => {
                if (i.itemGroup === group) i.unequip();
            });

            item.equip();
        },

        /**
         * Check if an item from given group is equipped
         * @memberOf Purse
         * @param  {number} group Number of the group
         * @return {boolean}
         */
        getEquippedItemOfGroup(group) {
            return this.getEquippedItems().find(item => item.itemGroup === group);
        },

        /**
         * Remove an item from this purse
         * @memberOf Purse
         * @param  {Item} item
         */
        remove(item) {
            const itemObj = (typeof item === 'number') ? this.getItem(item) : item;
            itemsInPurse = without(itemsInPurse, itemObj);
        },

        /**
         * Add a given amount of gold
         * @memberOf Purse
         * @param {number} amount
         */
        addGold(amount) {
            if (+amount) {
                this.gold += amount;
            }
        },

        /**
         * Return item with given id
         * @memberOf Purse
         * @param  {number} itemId
         * @return {Item}
         */
        getItem(itemId) {
            return itemsInPurse.find(item => item.id === itemId);
        },

        /**
         * Return all equipped item from this purse
         * @memberOf Purse
         * @return {Item[]} An array of equipped items
         */
        getEquippedItems() {
            return itemsInPurse.filter(item => item.isEquipped);
        },
    });
}
