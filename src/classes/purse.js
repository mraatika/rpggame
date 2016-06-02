import gameConfig from 'json!assets/config/gameconfig.json';
import {without, filter, find, isArray} from 'lodash';

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
        if (this.items.length == this.size) {
            return false;
        }

        if (!isArray(items)) {
            items = [items];
        }

        this.items = this.items.concat(items);
        return true;
    }

    /**
     * Remove an item from this purse
     * @param  {Item} item
     * @return {undefined}
     */
    remove(item) {
        let itemObj = (typeof item == 'number') ? this.getItem(item) : item;
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
        return find(this.items, i => i.id === itemId);
    }

    /**
     * Return all equipped item from this purse
     * @return {array} An array of equipped items
     */
    getEquippedItems() {
        return filter(this.items, item => item.isEquipped);
    }
}