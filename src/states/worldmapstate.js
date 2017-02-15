import { Signal, State } from 'phaser';
import Player from '../sprites/player';
import Sack from '../sprites/sack';
import Treasure from '../sprites/treasure';
import EnemyFactory from '../factories/enemyfactory';
import PathFinder from '../pathfinder/pathfinder';
import Round from '../common/round';
import EventDispatcher from '../events/eventdispatcher';
import EventTypes from '../events/eventtypes';
import HUD from '../hud/hud';
import MouseHandler from '../input/mousehandler';
import MapUtils from '../utils/maputils';
import Commands from '../commands/commands';

/**
 * Create the level map
 * @private
 * @return  {undefined}
 */
function createMap() {
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

function createPlayer() {
    const player = new Player(this.game, 16, 48);

    this.actors.add(player);

    return player;
}

function createHUD() {
    this.hud = new HUD(this);
    this.game.add.existing(this.hud);
}

function spawnEnemies() {
    const objects = this.map.objects.objectslayer;
    const enemies = objects.filter(obj => obj.type === 'enemy');
    const factory = new EnemyFactory(this);
    const sprites = enemies.map(e => factory.create(e));

    this.actors.addMultiple(sprites);
}

function createMapObjects() {
    this.treasures = this.game.add.group();
    this.map.createFromObjects('objectslayer', 11, 'tiles', 10, true, false, this.treasures, Treasure);
}

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
        this.map = createMap.call(this);
        this.mouseHandler = new MouseHandler(this).activate();
        this.actors = this.game.add.group();
        this.player = createPlayer.call(this);
        createMapObjects.call(this);
        createHUD.call(this);
        spawnEnemies.call(this);

        EventDispatcher.add(this.handleEvent, this);

        this.startNextRound();
    }

    /**
     * Update lifecycle method.
     * @return {undefined}
     */
    update() {
        if (this.currentRound.isDone) {
            this.startNextRound();
        }

        this.currentRound.update();
    }
    startNextRound() {
        this.actors.forEachDead(actor => actor.destroy());

        this.currentRound = new Round(this, this.actors.children);
        this.currentRound.start();
    }

    handleEvent(event) {
        switch (event.type) {
        case EventTypes.MOVE_EVENT:
            if (event.actor === this.player) {
                const tile = MapUtils.getTilePositionByCoordinates(this.player.position);
                const treasureInTile = MapUtils.isObjectOnTile(tile, this.treasures.children);

                if (treasureInTile) {
                    new Commands.LootCommand(this.player, treasureInTile).dispatch();
                    treasureInTile.kill();
                }
            }
            break;
        case EventTypes.ACTOR_KILLED_EVENT:
            {
                const actor = event.actor;
                const sack = new Sack(this.game, actor.x, actor.y, {
                    minGold: actor.minGold,
                    maxGold: actor.maxGold,
                    items: actor.items,
                });

                sack.center();

                this.treasures.add(sack);

                break;
            }
        default:
            break;
        }
    }
}
