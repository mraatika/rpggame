import SpriteBase from './spritebase';
import ItemFactory from '../factories/itemfactory';
import gameConfig from '../config/gameconfig.json';
import { randomByChance } from '../utils/utils';

/**
 * Treasure defaults from game config
 * @type {object}
 */
const config = gameConfig.treasure;

/**
 * @class Treasure
 * @description
 * @extends {SpriteBase}
 */
export default class Treasure extends SpriteBase {

    set items(items) {
        if (typeof items === 'string') {
            this.parsedItems = JSON.parse(items);
        }
    }

    get items() {
        return this.parsedItems;
    }

    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Treasure}
     */
    constructor(game, x, y, imageKey = 'treasure', frame, props = {}) {
        super(game, x, y, imageKey, frame);

        this.minGold = props.minGold || config.minGold;
        this.maxGold = props.maxGold || config.maxGold;
        this.trapChance = props.trapChance || config.trapChance;
        this.parsedItems = props.items || [];
    }

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
    }

    /**
     * Return trap damage if this treasure is trapped otherwise return 0
     * @return {number}
     */
    trapDamage() {
        if (randomByChance(this.trapChance)) {
            return config.damage;
        }

        return 0;
    }

    /**
     * Return random amount of gold
     * @private
     * @return {number}
     */
    lootGold() {
        return this.game.rnd.between(this.minGold, this.maxGold);
    }

    /**
     * Return a set of randomized items
     * @private
     * @return {Array}
     */
    lootItems() {
        const loot = [];
        const factory = new ItemFactory(this.game);

        Object.keys(this.items).forEach((key) => {
            const obj = this.items[key];
            if (randomByChance(obj.chance)) {
                loot.push(factory.create(obj.id));
            }
        });

        return loot;
    }
}
