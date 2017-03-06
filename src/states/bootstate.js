import { Signal, State } from 'phaser';
import WebFont from 'webfontloader';

/**
 * @name BootState
 * State in which to load levels and assets and such
 * @param {Phaser.Game} game
 * @returns {BootState}
 * @extends {State}
 */
export default function bootState(game) {
    const baseState = new State();

    const publicProps = {
        game,
        onStateDone: new Signal(),
    };

    const methods = {
         /**
         * Preload lifecycle method.
         * @return {undefined}
         */
        preload() {
            publicProps.game.stage.smoothed = false;
            // load assets needed for boot and loading states
            game.load.pack('boot', 'assets/assetpack.json');

            // load font from Google web fonts
            WebFont.load({
                custom: {
                    families: ['deutsch_gothicnormal', 'komika_axisregular'],
                    urls: ['assets/fonts/fonts.css'],
                },
            });
        },

        /**
         * Create lifecycle method.
         * @return {undefined}
         */
        create() {
            publicProps.game.input.mouse.capture = true;
            // prevent default browser right click menu
            publicProps.game.canvas.oncontextmenu = e => e.preventDefault();
            publicProps.onStateDone.dispatch();
        },
    };

    return Object.assign(
        baseState,
        publicProps,
        methods,
    );
}
