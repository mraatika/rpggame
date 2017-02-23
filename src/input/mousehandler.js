import { debounce } from 'lodash';
import { Sprite } from 'phaser';
import * as MapUtils from '../utils/maputils';
import Commands from '../commands/commands';
import TurnPhases from '../constants/turnphases';
import PointerMark from './pointermark';
import MouseTrail from './mousetrail';
import EnemyCardHandler from '../classes/enemycardmanager';

/**
 * Checks if player can attack given enemy
 * @param {Actor} actor
 * @param {Actor} enemy
 * @param {TurnPhase} turnPhase
 * @returns {Boolean}
 */
function canPlayerAttackEnemy(actor, enemy, turnPhase) {
    return turnPhase === TurnPhases.ACTION_PHASE &&
        MapUtils.isOnSurroundingTile(actor, enemy);
}

/**
 * On down handler for mouse click.
 * Debounced version of this will be send as a parameter to Phaser.
 * @private
 * @param {MouseHandler} mouseHandler
 * @param {Phaser.Pointer} pointer
 * @memberOf MouseHandler
 */
function onMouseDown(mouseHandler, pointer) {
    const { turn: currentTurn } = this.state.currentRound;
    const { actor: actorInTurn } = currentTurn;
    const { currentPhase } = currentTurn;
    const tile = MapUtils.getTilePositionByCoordinates(pointer.position);
    const enemyInTile = MapUtils.isSomeObjectOnTile(
        tile,
        this.state.actors.children,
        [this.state.player],
    );
    const canAttackEnemy = canPlayerAttackEnemy(actorInTurn, enemyInTile, currentPhase);

    // clean all mouse markers
    this.cleanUp();

    // display enemy details card if clicked with left button
    if (enemyInTile && !pointer.rightButton.isDown) {
        EnemyCardHandler.show(enemyInTile, actorInTurn, canAttackEnemy);
        return;
    }

    // do nothing if it's not player's turn
    if (!actorInTurn.isPlayerControlled) return;

    // if click is not within the map then do nothing
    if (!MapUtils.isWithinMap(this.state.map, tile)) return;

    const treasureInTile = MapUtils.isSomeObjectOnTile(tile, this.state.treasures.children);
    const actorPosition = MapUtils.getTilePositionByCoordinates(actorInTurn.position);

    // loot treasure without moving if it's on the surrounding tile
    if (treasureInTile && MapUtils.isOnSurroundingTile(actorInTurn, treasureInTile)) {
        new Commands.LootCommand(actorInTurn, treasureInTile).dispatch();
        return;
    }

    if (MapUtils.isSameTile(tile, actorPosition)) {
        new Commands.EndActionCommand(actorInTurn).dispatch();
        return;
    }

    if (enemyInTile && canAttackEnemy && pointer.rightButton.isDown) {
        new Commands.AttackCommand(actorInTurn, enemyInTile).dispatch();
        return;
    }

    this.game.pathFinder.findPath(actorPosition, tile, (path) => {
        if (path) {
            new Commands.MoveCommand(actorInTurn, path).dispatch();
        }
    });
}

/**
 * Check if movement target and path from actor to target is valid
 * @private
 * @param {Actor} actor actor's current position
 * @param {Point[]|null} path path from actor to target
 * @param {Point} pointerPosition movement target
 * @returns {Boolean}
 * @memberOf MouseHandler
 */
function isValidPath(actor, path, pointerPosition) {
    const enemies = this.state.actors.children;
    const isEnemyOnTile = MapUtils.isSomeObjectOnTile(pointerPosition, enemies);
    return !isEnemyOnTile && MapUtils.isValidPath(path, actor.movementPoints);
}

/**
 * Draw circle to represent movement target
 * @private
 * @param {Actor} actor
 * @param {Point} pointerPosition
 * @param {Point[]} path
 * @memberOf MouseHandler
 */
function drawPointer(actor, pointerPosition, path) {
    if (this.pointerMark) this.pointerMark.destroy();

    const isValid = isValidPath.call(this, actor, path, pointerPosition);
    const pointerColor = isValid ? 0x50FF0A : 0xFF2609;

    this.pointerMark = new PointerMark(this.game);
    this.pointerMark.draw(pointerPosition, pointerColor);
    this.state.bottomLayer.add(this.pointerMark);
}

/**
 * Draw a tail from actor's current position to pointer to represent path of movement
 * @private
 * @param {Actor} actor
 * @param {Point} actorPosition
 * @param {Point} pointerPosition
 * @param {Point[]} path
 * @memberOf MouseHandler
 */
function drawTrail(actor, actorPostion, pointerPosition, path) {
    if (this.mouseTrail) this.mouseTrail.destroy();

    if (path && path.length) {
        const isValid = isValidPath.call(this, actor, path, pointerPosition);
        const trailColor = isValid ? 0x50FF0A : 0xFF2609;
        this.mouseTrail = new MouseTrail(this.game);
        this.mouseTrail.draw(path, trailColor);
        this.state.bottomLayer.add(this.mouseTrail);
    }
}

/**
 * Check if trail should be drawn
 * @private
 * @param {Actor} actor
 * @param {Turn} turn
 * @returns {Boolean}
 * @memberOf MouseHandler
 */
function shouldMouseTrailBeDrawn(actor, turn) {
    return actor.isPlayerControlled &&
        turn.currentPhase === TurnPhases.MOVE_PHASE;
}

/**
 * Resolve pointer style
 * @param {Boolean} isEnemyOnTile
 * @param {TurnPhase} phase
 * @returns {String}
 */
function resolveCursorStyle(actor, enemy, treasure, phase) {
    let style = 'default';

    if (enemy) {
        style = canPlayerAttackEnemy(actor, enemy, phase) ?
            'url(assets/images/swords_crossed_icon_26x24.png) 13 12, pointer' :
            'pointer';
    }

    if (treasure && MapUtils.isOnSurroundingTile(actor, treasure)) {
        style = 'pointer';
    }

    return style;
}

/**
 * Callback for mouse move event
 * @private
 * @param {Phaser.Pointer} pointer
 * @memberOf MouseHandler
 */
function onMouseMove(pointer) {
    const { turn: currentTurn } = this.state.currentRound;
    const { actor: actorInTurn } = currentTurn;
    const { currentPhase } = currentTurn;
    const pointerPosition = MapUtils.getTilePositionByCoordinates(pointer.position);
    const actorPosition = MapUtils.getTilePositionByCoordinates(actorInTurn.position);
    const enemyInTile = MapUtils.isSomeObjectOnTile(
        pointerPosition,
        this.state.actors.children,
        [this.state.player],
    );
    const treasureInTile = MapUtils.isSomeObjectOnTile(
        pointerPosition,
        this.state.treasures.children,
    );

    this.game.canvas.style.cursor = resolveCursorStyle(
        actorInTurn,
        enemyInTile,
        treasureInTile,
        currentPhase,
    );

    if (shouldMouseTrailBeDrawn.call(this, actorInTurn, currentTurn)) {
        if (MapUtils.isWithinMap(this.state.map, pointerPosition)) {
            this.game.pathFinder.findPath(actorPosition, pointerPosition, (path) => {
                if (enemyInTile) {
                    this.cleanUp();
                } else {
                    drawPointer.call(this, actorInTurn, pointerPosition, path);
                    drawTrail.call(this, actorInTurn, actorPosition, pointerPosition, path);
                }
            });
        } else {
            this.cleanUp();
        }
    }
}

/**
 * @class MouseHandler
 * @description An invisible overlay sprite above game canvas responsible for capturing
 *              mouse clicks. Prevents clickthroughs when clicking hud elements.
 * @extends {Sprite}
 */
export default class MouseHandler extends Sprite {

    /**
     * Creates an instance of MouseHandler.
     * @param {Phaser.State} state
     * @memberOf MouseHandler
     */
    constructor(state) {
        super(state.game, 0, 0);

        this.state = state;
        this.game = state.game;

        this.width = this.game.width;
        this.height = this.game.height;

        this.game.add.existing(this);
    }

    /**
     * Start listening to mouse events
     * @return {MouseHandler} this
     * @memberOf MouseHandler
     */
    activate() {
        this.inputEnabled = true;

        // debounce to prevent clicks while processing previous
        this.mouseDownCallback = debounce(
            onMouseDown,
            200,
            { leading: true, trailing: false },
        );
        this.events.onInputDown.add(this.mouseDownCallback, this);
        // should always have the lowest priority when resolving a click target
        this.input.priorityID = 0;

        this.game.input.addMoveCallback(onMouseMove, this);

        return this;
    }

    /**
     * Stop listening the mouse events
     * @memberOf MouseHandler
     */
    deactivate() {
        this.inputEnabled = false;
        this.cleanUp();
        this.events.onInputDown.removeAll(this);
    }

    /**
     * Clean up all mouse markings (mouse trail etc.)
     * @memberOf MouseHandler
     */
    cleanUp() {
        if (this.mouseTrail) this.mouseTrail.destroy();
        if (this.pointerMark) this.pointerMark.destroy();
    }
}
