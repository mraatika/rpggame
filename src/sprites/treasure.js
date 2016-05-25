import SpriteBase from 'sprites/spritebase';
import Dice from 'classes/dice';
import gameConfig from 'json!assets/config/gameconfig.json';

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
    constructor(game, x, y) {
        super(game, x, y, 'treasure');
    }

    /**
     * Return random amount of gold
     * @return {number}
     */
    lootGold() {
        return this.game.rnd.between(config.minGold, config.maxGold);
    }

    /**
     * Return a set of randomized items
     * @return {Array}
     */
    lootItems() {
        return [];
    }

    /**
     * Throw for trap chance
     * @return {boolean}
     */
    isTrap() {
        return new Dice(6).throw() <= config.trapChance;
    }
}