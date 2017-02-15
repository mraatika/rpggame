import { Signal, State } from 'phaser';
import WebFont from 'webfontloader';

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

        // load font from Google web fonts
        WebFont.load({
            custom: {
                families: ['deutsch_gothicnormal', 'komika_axisregular'],
                urls: ['assets/fonts/fonts.css'],
            },
        });
    }

    /**
     * Create lifecycle method.
     * @return {undefined}
     */
    create() {
        this.game.input.mouse.capture = true;
        // prevent default browser right click menu
        this.game.canvas.oncontextmenu = e => e.preventDefault();

        this.onStateDone.dispatch();
    }

    /**
     * Update lifecycle method.
     * @return {undefined}
     */
    update() {

    }
}
