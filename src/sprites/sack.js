import Treasure from 'sprites/treasure';

/**
 * @class LootSack
 * @description A type of treasure that the enemies drop
 * @extends {Treasure}
 */
export default class LootSack extends Treasure {
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @param       {object} props
     * @return      {LootSack}
     */
    constructor(...params) {
        super(...params, 'tiles');
        this.frame = 9;
        this.trapChance = 0;
    }
}