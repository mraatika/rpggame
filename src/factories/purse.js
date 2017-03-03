import { without } from 'lodash';
import gameConfig from '../config/gameconfig.json';
import Events from '../events/events';

/**
 * Configurations for Purse class
 * @type {object}
 */
const config = gameConfig.player.purse;

/**
 * Factory function for creating a Purse object that acts
 * as a container for characters items.
 * @name Purse
 * @param {number} [size=gameConfig.player.purse.size]
 * @returns {Purse}
 */
export default function createPurse(size = config.size) {
    return Object.create({
        size,
        items: [],
        gold: 0,

        /**
         * Add an item to this purse if it fits
         * @param {Item} item
         * @returns {boolean} True if added succesfully
         */
        add(items = []) {
            const addedItems = [].concat(items);
            const availableSpace = this.size - this.items.length;

            if (addedItems.length > availableSpace) {
                // remove items that won't fit from added items array
                const leftOut = addedItems.splice(availableSpace);
                new Events.ItemDroppedEvent(leftOut).dispatch();
            }

            // add all items that fit purse
            this.items = this.items.concat(addedItems);
        },

        /**
         * Equip an item
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
         * @param  {number} group Number of the group
         * @return {Boolean}
         */
        getEquippedItemOfGroup(group) {
            return this.getEquippedItems().find(item => item.itemGroup === group);
        },

        /**
         * Remove an item from this purse
         * @param  {Item} item
         * @return {undefined}
         */
        remove(item) {
            const itemObj = (typeof item === 'number') ? this.getItem(item) : item;
            this.items = without(this.items, itemObj);
        },

        /**
         * Add a given amount of gold
         * @param {number} amount
         */
        addGold(amount) {
            if (+amount) {
                this.gold += amount;
            }
        },

        /**
         * Return item with given id
         * @param  {number} itemId
         * @return {Item}
         */
        getItem(itemId) {
            return this.items.find(item => item.id === itemId);
        },

        /**
         * Return all equipped item from this purse
         * @return {array} An array of equipped items
         */
        getEquippedItems() {
            return this.items.filter(item => item.isEquipped);
        },
    });
}
