// eslint-disable-next-line
import 'pixi';
// eslint-disable-next-line
import 'phaser';
import Game from './game/game';
import gameConfig from './config/gameconfig.json';

const game = new Game(gameConfig.screen.width, gameConfig.screen.height);

game.start();
