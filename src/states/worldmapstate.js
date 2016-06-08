import {Point, Signal, State} from 'phaser';
import {filter, find, map} from 'lodash';
import Player from 'sprites/player';
import Sack from 'sprites/sack';
import Treasure from 'sprites/treasure';
import EnemyFactory from 'factories/enemyfactory';
import PathFinder from 'pathfinder/pathfinder';
import Round from 'common/round';
import MapUtils from 'common/maputils';
import EventDispatcher from 'events/eventdispatcher';
import EventTypes from 'events/eventtypes';
import Commands from 'commands/commands';
import HUD from 'hud/hud';

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
        this._createMapObjects();
        this._createHUD();
        this._spawnEnemies();

        //this.game.world.scale.setTo(2.5);
        this.game.input.mouse.capture = true;

        this.game.input.onDown.add(this._onMouseDown, this);

        EventDispatcher.add(this._handleEvent, this);

        this._startNextRound();
    }

    _onMouseDown(pointer) {
        const tile = MapUtils.getTilePositionByCoordinates(pointer.position);
        const actorInTurn = this.currentRound.turn.actor;
        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(actorInTurn.x, actorInTurn.y));

        if (actorInTurn !== this.player) {
            return false;
        }

        const enemyInTile = this._isInTile(this.actors.children, tile, [ actorInTurn ]);
        const treasureInTile = this._isInTile(this.treasures.children, tile);

        if (treasureInTile) {
            new Commands.LootCommand(actorInTurn, treasureInTile).dispatch();
        }

        if (MapUtils.isSameTile(tile, actorPosition)) {
            new Commands.EndActionCommand(actorInTurn).dispatch();
        } else if (enemyInTile) {
            new Commands.AttackCommand(actorInTurn, enemyInTile).dispatch();
        } else {
            // endpoint is false if it's occupied or the tile is a blocking tile
            this.game.pathFinder.findPath(actorPosition, tile, path => {
                new Commands.MoveCommand(actorInTurn, path).dispatch();
            });
        }
    }

    _isInTile(objects, tile, excludes = []) {
        return find(objects, o => {
            const position = MapUtils.getTilePositionByCoordinates(new Point(o.x, o.y));
            return excludes.indexOf(o) < 0 && MapUtils.isSameTile(tile, position);
        });
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

    _createMapObjects() {
        this.treasures = this.game.add.group();
        this.map.createFromObjects('objectslayer', 11, 'tiles', 10, true, false, this.treasures, Treasure);
    }

    _createPlayer() {
        const player = new Player(this.game, 16, 16);

        this.actors.add(player);

        return player;
    }

    _createHUD() {
        this.hud = new HUD(this);
        this.game.add.existing(this.hud);
        //this.hud.add(new MessageBoard(this.game, 0, this.game.height - 200));
    }

    _spawnEnemies() {
        const enemies = this._findTileMapObjectsByType('enemy');
        const factory = new EnemyFactory(this);

        const sprites = map(enemies, e => {
            return factory.create(e);
        });

        this.actors.addMultiple(sprites);
    }

    _startNextRound() {
        this.actors.forEachDead(actor => actor.destroy());

        this.currentRound = new Round(this, this.actors.children);
        this.currentRound.start();
    }

    /**
     * Find an object of given type from the tile map's objects layer
     * @private
     * @param   {string} type Type of the object
     * @return  {array} An array of objects with matching type
     */
    _findTileMapObjectsByType(type) {
        return filter(this.map.objects['objectslayer'], obj => obj.type === type);
    }

    _handleEvent(event) {
        switch (event.type) {
        case EventTypes.ACTOR_KILLED_EVENT:
            {
                console.log('CREATING A LOOT SACK!');
                const actor = event.actor;
                const sack = new Sack(this.game, actor.x, actor.y, {
                    minGold: actor.minGold,
                    maxGold: actor.maxGold,
                    items: actor.items
                });

                sack.center();

                this.treasures.add(sack);

                break;
            }
        }
    }
}