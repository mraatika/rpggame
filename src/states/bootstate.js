import {Signal, State} from 'phaser';

/**
 * @class BootState
 * @description State in which to load levels and assets and such
 * @extends {State}
 */
export default class BootState extends State {
    /**
     * @constructor
     * @param       {Game} Phaser.Game object
     * @return      {BootState}
     */
    constructor(game) {
        super();
        this.game = game;
        this.onStateDone = new Signal();
    }

    /**
     * Preload lifecycle method.
     * @return {undefined}
     */
    preload() {
        this.game.stage.smoothed = false;
        // load assets needed for boot and loading states
        this.game.load.pack('boot', 'assets/assetpack.json');
    }

    /**
     * Create lifecycle method.
     * @return {undefined}
     */
    create() {
        this.onStateDone.dispatch();
    }

    /**
     * Update lifecycle method.
     * @return {undefined}
     */
    update() {

    }

}