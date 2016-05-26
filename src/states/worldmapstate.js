import {Signal, State} from 'phaser';
import Player from 'sprites/player';
import Enemy from 'sprites/enemy';
import PathFinder from 'pathfinder/pathfinder';
import Round from 'classes/round';
//import MessageBoard from 'hud/messageboard';

/**
 * @class WorldMapState
 * @description
 * @extends {State}
 */
export default class WorldMapState extends State {
    /**
     * @constructor
     * @param   {Game} game A Phaser.Game object
     * @return  {WorldMapState}
     */
    constructor(game) {
        super();
        this.game = game;
        this.onStateDone = new Signal();
        this.game.pathFinder = new PathFinder(game, { sync: true });
    }

    /**
     * Preload lifecycle method.
     * @return {undefined}
     */
    preload() {

    }

    /**
     * Create lifecycle method.
     * @return {undefined}
     */
    create() {
        this.map = this._createMap();
        this.player = this._createPlayer();
        this._createHUD();
        this._spawnEnemies();
        //this.game.world.scale.setTo(2.5);
        this.game.input.mouse.capture = true;
        this._startNextRound();
    }

    /**
     * Update lifecycle method.
     * @return {undefined}
     */
    update() {
        //this.game.physics.arcade.collide(this.player, this.wallsLayer);

        if (this.currentRound.isDone) {
            this._startNextRound();
        }

        this.currentRound.update();
    }

    /**
     * Create the level map
     * @private
     * @return  {undefined}
     */
    _createMap() {
        const map = this.game.add.tilemap('world_tilemap');
        map.addTilesetImage('tiles', 'tiles');

        // the floor layer
        this.groundLayer = map.createLayer('groundlayer');

        // the walls
        this.wallsLayer = map.createLayer('wallslayer');

        // detect collisions to the objects on the wall layer
        map.setCollisionBetween(1, 100, true, 'wallslayer');

        this.groundLayer.resizeWorld();

        this.game.pathFinder.setGrid(map, 'wallslayer');

        return map;
    }

    _createPlayer() {
        const player = new Player(this.game, 16, 16);

        this.game.add.existing(player);

        return player;
    }

    _createHUD() {
        this.hud = this.game.add.group();
        this.hud.fixedToCamera = true;
        //this.hud.add(new MessageBoard(this.game, 0, this.game.height - 200));
    }

    _spawnEnemies() {
        this.enemies = this.game.add.group();
        const enemy = new Enemy(this.game, 144, 144, { target: this.player });
        this.enemies.add(enemy);
    }

    _startNextRound() {
        this.currentRound = new Round(this.game, this.map, [this.player].concat(this.enemies.children));
        this.currentRound.start();
    }
}