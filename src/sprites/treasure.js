import SpriteBase from 'sprites/spritebase';
import Dice from 'classes/dice';
import gameConfig from 'json!assets/config/gameconfig.json';
import {NumberUtils} from 'utils/utils';

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
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Treasure}
     */
    constructor(game, x, y, props = {}, imageKey = 'treasure') {
        super(game, x, y, imageKey);

        this.minGold = props.minGold || config.minGold;
        this.maxGold = props.maxGold || config.maxGold;
        this.trapChance = props.trapChance || config.trapChance;
        this.items = props.items || [];
    }

    /**
     * Loot items and gold of this treasure. If this is trapped
     * then damage player with the amount of config.damage
     * @param  {Actor} actorLooting Actor who is doing the looting
     * @return {Object}
     *         {number} gold
     *         {Item[]} items
     */
    loot(actorLooting) {
        if (NumberUtils.randomByChance(this.trapChance)) {
            actorLooting.damage(config.damage);
        }

        return {
            gold: this._lootGold(),
            items: this._lootItems()
        };
    }

    /**
     * Return random amount of gold
     * @private
     * @return {number}
     */
    _lootGold() {
        return this.game.rnd.between(this.minGold, this.maxGold);
    }

    /**
     * Return a set of randomized items
     * @private
     * @return {Array}
     */
    _lootItems() {
        const loot = [];

        for (let i of this.items) {
            if (NumberUtils.randomByChance(i.chance)) {
                const item = gameConfig.items[i.id];
                item.isEquipped = true;
                loot.push(item);
            }
        }

        return loot;
    }
}