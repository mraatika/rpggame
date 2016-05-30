import {Point, Signal, State} from 'phaser';
import {find} from 'lodash';
import Player from 'sprites/player';
import Enemy from 'sprites/enemy';
import PathFinder from 'pathfinder/pathfinder';
import Round from 'common/round';
import MapUtils from 'common/maputils';
import CommandEmitter from 'commands/commandemitter';

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
        this.actors = this.game.add.group();
        this.player = this._createPlayer();
        this._createHUD();
        this._spawnEnemies();
        //this.game.world.scale.setTo(2.5);
        this.game.input.mouse.capture = true;

        this.game.input.onDown.add(this._onMouseDown, this);
        this._startNextRound();
    }

    _onMouseDown(pointer) {
        const tile = MapUtils.getTilePositionByCoordinates(pointer.position);
        const actorInTurn = this.currentRound.turn.actor;
        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(actorInTurn.x, actorInTurn.y));

        if (actorInTurn !== this.player) {
            return false;
        }

        const enemyInTile = find(this.actors.children, actor => {
            const position = MapUtils.getTilePositionByCoordinates(new Point(actor.x, actor.y));
            return actor !== actorInTurn && MapUtils.isSameTile(tile, position);
        });

        if (MapUtils.isSameTile(tile, actorPosition)) {
            CommandEmitter.endAction(actorInTurn);
        } else if (enemyInTile) {
            CommandEmitter.attack(actorInTurn, enemyInTile);
        } else {
            // endpoint is false if it's occupied or the tile is a blocking tile
            this.game.pathFinder.findPath(actorPosition, tile, path => {
                CommandEmitter.move(actorInTurn, path);
            });
        }
    }

    /**
     * Update lifecycle method.
     * @return {undefined}
     */
    update() {
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
        this.game.pathFinder.setProperty('sync', true);

        return map;
    }

    _createPlayer() {
        const player = new Player(this.game, 16, 16);

        this.actors.add(player);

        return player;
    }

    _createHUD() {
        this.hud = this.game.add.group();
        this.hud.fixedToCamera();
        //this.hud.add(new MessageBoard(this.game, 0, this.game.height - 200));
    }

    _spawnEnemies() {
        const enemy = new Enemy(this.game, 144, 144, { target: this.player });
        this.player.target = enemy;
        this.actors.add(enemy);
    }

    _startNextRound() {
        this.currentRound = new Round(this, this.actors.children);
        this.currentRound.start();
    }
}