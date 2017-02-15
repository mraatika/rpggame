import Phaser from 'phaser';
import StateManager from '../common/statemanager';

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
    constructor(width, height) {
        super(width, height, Phaser.CANVAS, 'phaser-game', null, false, true, Phaser.Physics.ARCADE);
        this.stateManager = new StateManager(this);
    }

    start() {
        this.stateManager.start();
    }
}
