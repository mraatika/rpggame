import Phaser from 'phaser';

/**
 * @class Game
 * @description The main game class
 * @extends {Game}
 */
export default class Game extends Phaser.Game {
    /**
     * @constructor
     * @param       {number} width Width of the canvas
     * @param       {number} height Height of the canvas
     * @return      {Game}
     */
    constructor (width, height) {
        super(width, height, Phaser.Auto, 'phaser-game');
    }
}