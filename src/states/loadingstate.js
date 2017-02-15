import { Signal, State } from 'phaser';

/**
 * @class LoadingState
 * @description State in which to load levels and assets and such
 * @extends {State}
 */
export default class LoadingState extends State {
    /**
     * @constructor
     * @param       {Game} Phaser.Game object
     * @return      {LoadingState}
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
        const { world } = this.game;
        const loadingBar = this.game.add.sprite(world.centerX, world.centerY, 'loading');

        loadingBar.anchor.set(0.5);

        this.load.setPreloadSprite(loadingBar);

        // load common game assets
        this.game.load.pack('common', 'assets/assetpack.json');
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
