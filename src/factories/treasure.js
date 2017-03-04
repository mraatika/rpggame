import { randomByChance, randomBetween } from '../utils/utils';
import createItem from '../factories/item';
import gameconfig from '../config/gameconfig.json';

const config = gameconfig.treasure;

/**
 * @export
 * @name Treasure
 * Factory function for creating treasures
 * @param {Object} [props={}]
 *     {Item[]} [items=[]],
 *     {number} [minGold=config.minGold],
 *     {number} [maxGold=config.maxGold],
 *     {number} [damage=config.damage],
 *     {number} [trapChance=config.trapChance],
 * @returns {Treasure}
 */
export default function createTreasure({
    items = [],
    minGold = config.minGold,
    maxGold = config.maxGold,
    damage = config.damage,
    trapChance = config.trapChance,
} = {}) {
    /**
     * Treasure's public props
     */
    const publicProps = {
        trapChance,
    };

    /**
     * Randomize the amount of gold returned when looting
     * @private
     * @memberOf Treasure
     * @returns {number}
     */
    function lootGold() {
        return randomBetween(minGold, maxGold);
    }

     /**
     * Throw for each item if it's returned when looting
     * @private
     * @memberOf Treasure
     * @returns {Item[]}
     */
    function lootItems() {
        return items.reduce((arr, i) =>
            (randomByChance(i.chance) ? arr.concat(createItem(i)) : arr), []);
    }

    /**
     * Treasure's public methods
     */
    const methods = {
        /**
         * Loot items and gold of this treasure
         * @memberOf Treasure
         * @return {Object}
         *  {number} gold
         *  {Item[]} items
         */
        loot() {
            return {
                gold: lootGold(),
                items: lootItems(),
            };
        },

        /**
         * Return trap damage if this treasure is trapped otherwise return 0
         * @memberOf Treasure
         * @return {number}
         */
        trapDamage() {
            return randomByChance(trapChance) ? damage : 0;
        },
    };

    return Object.assign(
        {},
        publicProps,
        methods,
    );
}
