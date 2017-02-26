import { without } from 'lodash';
import gameConfig from '../config/gameconfig.json';

/**
 * Configurations for Purse class
 * @type {object}
 */
const config = gameConfig.player.purse;

/**
 * @class Purse
 * @description A container for items
 */
export default class Purse {

    /**
     * Return the amount of items in this purse
     * @return {number}
     */
    get length() {
        return this.items.length;
    }

    /**
     * @constructor
     * @param       {number} [size] Maximum amount of items this purse can hold
     * @return      {Purse}
     */
    constructor(size = config.size) {
        this.size = size;
        this.items = [];
        this.gold = 0;
    }

    /**
     * Add an item to this purse if it fits
     * @param {Item} item
     * @returns {boolean} True if added succesfully
     */
    add(items) {
        if (this.items.length === this.size) {
            return false;
        }

        this.items = this.items.concat(items);

        return true;
    }

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
    }

    /**
     * Check if an item from given group is equipped
     * @param  {number} group Number of the group
     * @return {Boolean}
     */
    getEquippedItemOfGroup(group) {
        return this.getEquippedItems().find(item => item.itemGroup === group);
    }

    /**
     * Remove an item from this purse
     * @param  {Item} item
     * @return {undefined}
     */
    remove(item) {
        const itemObj = (typeof item === 'number') ? this.getItem(item) : item;
        this.items = without(this.items, itemObj);
    }

    /**
     * Add a given amount of gold
     * @param {number} amount
     */
    addGold(amount) {
        if (+amount) {
            this.gold += amount;
        }
    }

    /**
     * Return item with given id
     * @param  {number} itemId
     * @return {Item}
     */
    getItem(itemId) {
        return this.items.find(item => item.id === itemId);
    }

    /**
     * Return all equipped item from this purse
     * @return {array} An array of equipped items
     */
    getEquippedItems() {
        return this.items.filter(item => item.isEquipped);
    }
}
