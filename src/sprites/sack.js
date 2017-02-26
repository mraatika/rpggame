import Treasure from './treasure';

/**
 * @class Sack
 * @description A type of treasure that the enemies drop
 * @extends {Treasure}
 */
export default class Sack extends Treasure {
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @param       {object} props
     * @return      {Sack}
     */
    constructor(game, x, y, props) {
        super(game, x, y, 'tiles', 9, props);
        this.trapChance = 0;
        this.center();
    }
}
