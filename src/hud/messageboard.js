import {Sprite} from 'phaser';

/**
 * @class MessageBoard
 * @description
 * @extends {Sprite}
 */
export default class MessageBoard extends Sprite {
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {MessageBoard}
     */
    constructor(game, x, y) {
        super(game, x, y, 'overlay');
        this.width = 400;
        this.height = 200;
        this.alpha = .8;
    }

    /**
     * Update lifecycle method
     * @return {undefined}
     */
    update() {

    }
}