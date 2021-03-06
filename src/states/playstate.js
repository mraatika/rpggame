import { Signal, State } from 'phaser';
import createPlayerSprite from '../sprites/playersprite';
import createTreasureSprite from '../sprites/treasuresprite';
import createSackSprite from '../sprites/sack';
import { fromMapObject } from '../sprites/enemysprite';
import pathFinder from '../movement/pathfinder';
import Round from '../game/round';
import EventDispatcher from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import HUD from '../hud/hud';
import MouseHandler from '../input/mousehandler';
import { getTilePositionByCoordinates, isSomeObjectOnTile } from '../utils/maputils';
import lootCommand from '../commands/lootcommand';
import { sendCommand } from '../commands/commanddispatcher';
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
    this.player = createPlayerSprite(this.game, 16, 48);
    this.actors.add(this.player);
}

function createHUD() {
    this.hud = new HUD(this);
    this.game.add.existing(this.hud);
}

function spawnEnemies() {
    const objects = this.map.objects.objectslayer;
    const enemies = objects.filter(obj => obj.type === 'enemy');
    const sprites = enemies.map(enemy => fromMapObject(this.game, this.player, enemy));

    this.actors.addMultiple(sprites);
}

function createMapObjects() {
    const objects = this.map.objects.objectslayer;
    const treasures = objects.filter(obj => obj.type === 'treasure');
    const sprites = treasures.map(treasure => createTreasureSprite(
        this.game, treasure.x + 16, treasure.y - 16, 10, treasure.properties,
    ));
    this.treasures.addMultiple(sprites);
}

/**
 * Add new treasure sack to the game
 * @private
 * @param {Object} [props={}]
 */
function addTreasureSack({
    x,
    y,
    minGold,
    maxGold,
    items,
    shouldThrowForItems,
} = {}) {
    // treasure sacks are never trapped
    const sackSprite = createSackSprite(
        this.game, x, y, { items, minGold, maxGold, shouldThrowForItems },
    );
    this.treasures.add(sackSprite);
}

/**
 * @name PlayState
 * The state that handles the actual gameplay
 * @param {Phaser.Game} game
 * @return {PlayState}
 * @extends {State}
 */
export default function playState(game) {
    const baseState = new State();

    const publicProps = {
        game,
        onStateDone: new Signal(),
    };

    const methods = {
        /**
         * Create lifecycle method.
         * @memberOf PlayState
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

            this.game.pathFinder = pathFinder({
                map: this.map,
                layer: 'wallslayer',
                obstacles: this.actors.children,
            }, { sync: true });

            this.startNextRound();
        },

        /**
         * Update lifecycle method.
         * @return {undefined}
         */
        update() {
            if (this.currentRound.isDone) {
                this.startNextRound();
            }

            this.currentRound.update();
        },

        startNextRound() {
            this.actors.forEachDead(actor => actor.destroy());

            this.currentRound = new Round(this, this.actors.children);
            this.currentRound.start();
        },

        handleEvent(event) {
            switch (event.type) {
            case EventTypes.MOVE_EVENT:
                if (event.actor === this.player) {
                    const tile = getTilePositionByCoordinates(this.player.position);
                    const treasureInTile = isSomeObjectOnTile(tile, this.treasures.children);

                    if (treasureInTile) {
                        sendCommand(lootCommand(this.player, treasureInTile));
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
                        shouldThrowForItems: true,
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
                        items: [].concat(event.item),
                    });
                    break;
                }
            default:
                break;
            }
        },
    };

    return Object.assign(
        baseState,
        publicProps,
        methods,
    );
}
