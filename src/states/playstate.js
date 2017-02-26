import { Signal, State } from 'phaser';
import Player from '../sprites/player';
import Sack from '../sprites/sack';
import Treasure from '../sprites/treasure';
import EnemyFactory from '../factories/enemyfactory';
import PathFinder from '../movement/pathfinder';
import Round from '../game/round';
import EventDispatcher from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import HUD from '../hud/hud';
import MouseHandler from '../input/mousehandler';
import { getTilePositionByCoordinates, isSomeObjectOnTile } from '../utils/maputils';
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

    return map;
}

function createPlayer() {
    const player = new Player(this.game, 16, 48);
    this.actors.add(player);
    this.player = player;
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
    this.map.createFromObjects('objectslayer', 11, 'tiles', 10, true, false, this.treasures, Treasure);
}

function addTreasureSack(props = {}) {
    const sack = new Sack(this.game, props.x, props.y, {
        minGold: props.minGold,
        maxGold: props.maxGold,
        items: props.items,
    });

    this.treasures.add(sack);
}

/**
 * @class PlayState
 * @description
 * @extends {State}
 */
export default class PlayState extends State {
    /**
     * @constructor
     * @param   {Game} game A Phaser.Game object
     * @return  {WorldMapState}
     */
    constructor(game) {
        super();
        this.game = game;
        this.onStateDone = new Signal();
    }

    /**
     * Create lifecycle method.
     * @return {undefined}
     */
    create() {
        this.map = createMap.call(this);
        this.mouseHandler = new MouseHandler(this).activate();

        this.bottomLayer = this.game.add.group();
        this.topLayer = this.game.add.group();

        this.treasures = this.game.add.group();
        this.actors = this.game.add.group();

        createPlayer.call(this);
        createMapObjects.call(this);
        createHUD.call(this);
        spawnEnemies.call(this);

        EventDispatcher.add(this.handleEvent, this);

        this.topLayer.addMultiple([this.actors, this.treasures]);

        this.game.pathFinder = new PathFinder({
            map: this.map,
            layer: 'wallslayer',
            obstacles: this.actors.children,
        }, { sync: true });

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
                const tile = getTilePositionByCoordinates(this.player.position);
                const treasureInTile = isSomeObjectOnTile(tile, this.treasures.children);

                if (treasureInTile) {
                    new Commands.LootCommand(this.player, treasureInTile).dispatch();
                    treasureInTile.kill();
                }
            }
            break;
        case EventTypes.ACTOR_KILLED_EVENT:
            {
                const actor = event.actor;
                addTreasureSack.call(this, {
                    x: actor.x,
                    y: actor.y,
                    minGold: actor.minGold,
                    maxGold: actor.maxGold,
                    items: actor.items,
                });
                break;
            }
        case EventTypes.END_ACTION_EVENT:
        case EventTypes.END_TURN_EVENT:
            if (event.actor === this.player) this.mouseHandler.cleanUp();
            break;
        case EventTypes.ITEM_DROPPED_EVENT:
            {
                const actor = this.currentRound.turn.actor;
                addTreasureSack.call(this, {
                    x: actor.x,
                    y: actor.y,
                    maxGold: 0,
                    items: [event.item],
                });
                break;
            }
        default:
            break;
        }
    }
}
