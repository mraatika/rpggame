import 'pixi';
import 'phaser';
import createGame from './game/game';
import gameConfig from './config/gameconfig.json';
import '../public/styles.css';

const game = createGame(gameConfig.screen.width, gameConfig.screen.height);

game.start();
