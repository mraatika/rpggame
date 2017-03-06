import Phaser from 'phaser';
import StateManager from '../states/statemanager';

/**
 * @class Game
 * @description The main game class
 * @extends {Game}
 */
export default function createGame(width, height) {
    const game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-game', null, false, true, Phaser.Physics.ARCADE);

    const publicProps = {
        stateManager: new StateManager(game),
    };

    const methods = {
        /**
         * Start the game
         * @memberOf Game
         */
        start() {
            publicProps.stateManager.start();
        },
    };

    return Object.assign(
        game,
        publicProps,
        methods,
    );
}
