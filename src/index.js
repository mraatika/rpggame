import 'pixi';
import 'phaser';
import Game from './game/game';
import gameConfig from './config/gameconfig.json';
import '../public/styles.css';

const game = new Game(gameConfig.screen.width, gameConfig.screen.height);

game.start();
