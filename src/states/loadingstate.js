import { Signal, State } from 'phaser';

/**
 * @name LoadingState
 * State in which to load levels and assets and such
 * @param {Phaser.Game} game
 * @return {LoadingState}
 * @extends {State}
 */
export default function loadingState(game) {
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
            const { world } = game;
            const loadingBar = game.add.sprite(world.centerX, world.centerY, 'loading');

            loadingBar.anchor.set(0.5);

            baseState.load.setPreloadSprite(loadingBar);

            // load common game assets
            game.load.pack('common', 'assets/assetpack.json');
        },

        /**
         * Create lifecycle method.
         * @return {undefined}
         */
        create() {
            publicProps.onStateDone.dispatch();
        },
    };

    return Object.assign(
        baseState,
        publicProps,
        methods,
    );
}
