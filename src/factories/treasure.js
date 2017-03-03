import { randomByChance, randomBetween } from '../utils/utils';
import createItem from '../factories/item';
import gameConfig from '../config/gameconfig.json';

/**
 * Default properties for treasure.
 * Mostly for documentation purposes.
 */
const defaultProps = {
    items: [],
    minGold: 0,
    maxGold: 0,
    trapChance: 0,
    damage: 0,
};

export default function createTreasure(props = {}) {
    return Object.assign(
        {},
        // default treasure props
        defaultProps,
        // props shared by all treasures
        gameConfig.treasure,
        // props to override defaults with
        props,
        // methods
        {
            /**
             * Loot items and gold of this treasure
             * @return {Object}
             *         {number} gold
             *         {Item[]} items
             */
            loot() {
                return {
                    gold: this.lootGold(),
                    items: this.lootItems(),
                };
            },

            /**
             * Return trap damage if this treasure is trapped otherwise return 0
             * @return {number}
             */
            trapDamage() {
                return randomByChance(this.trapChance) ? this.damage : 0;
            },

            /**
             * Return random amount of gold
             * @private
             * @return {number}
             */
            lootGold() {
                return randomBetween(this.minGold, this.maxGold);
            },

            /**
             * Return a set of randomized items
             * @private
             * @return {Array}
             */
            lootItems() {
                const loot = [];

                Object.keys(this.items).forEach((key) => {
                    const obj = this.items[key];
                    if (randomByChance(obj.chance)) {
                        loot.push(createItem(obj));
                    }
                });

                return loot;
            },
        },
    );
}
