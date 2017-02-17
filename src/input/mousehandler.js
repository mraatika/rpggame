import { debounce } from 'lodash';
import { Sprite } from 'phaser';
import * as MapUtils from '../utils/maputils';
import Commands from '../commands/commands';
import TurnPhases from '../constants/turnphases';
import PointerMark from './pointermark';
import MouseTrail from './mousetrail';

/**
 * On down handler for mouse click.
 * Debounced version of this will be send as a parameter to Phaser.
 * @private
 * @param   {MouseHandler} mouseHandler this
 * @param   {Phaser.Pointer} pointer
 */
function onMouseDown(mouseHandler, pointer) {
    const { turn: currentTurn } = this.state.currentRound;
    const { actor: actorInTurn } = currentTurn;
    const tile = MapUtils.getTilePositionByCoordinates(pointer.position);
    const enemyInTile = MapUtils.isSomeObjectOnTile(
        tile,
        this.state.actors.children,
        [this.state.player],
    );
    const canAttackEnemy = currentTurn.currentPhase === TurnPhases.ACTION_PHASE &&
        MapUtils.isOnSurroundingTile(actorInTurn, enemyInTile);

    // clean all mouse markers
    this.cleanUp();

    // display enemy details card if clicked with left button
    if (enemyInTile && !pointer.rightButton.isDown) {
        enemyInTile.showEnemyCard(actorInTurn, currentTurn, canAttackEnemy);
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
        new Commands.MoveCommand(actorInTurn, path).dispatch();
    });
}

function isValidPath(actor, path) {
    return MapUtils.isValidPath(path, actor.movementPoints);
}

function drawPointer(actor, pointerPosition, path) {
    if (this.pointerMark) this.pointerMark.destroy();

    const isValid = isValidPath.call(this, actor, path);
    const pointerColor = isValid ? 0x50FF0A : 0xFF2609;

    this.pointerMark = new PointerMark(this.game);
    this.pointerMark.draw(pointerPosition, pointerColor);
    this.state.bottomLayer.add(this.pointerMark);
}

function drawTrail(actor, actorPostion, pointerPosition, path) {
    if (this.mouseTrail) this.mouseTrail.destroy();

    if (path && path.length) {
        const isValid = isValidPath.call(this, actor, path);
        const trailColor = isValid ? 0x50FF0A : 0xFF2609;
        this.mouseTrail = new MouseTrail(this.game);
        this.mouseTrail.draw(path, trailColor);
        this.state.bottomLayer.add(this.mouseTrail);
    }
}

function shouldMouseTrailBeDrawn(actor, turn) {
    return actor.isPlayerControlled &&
        turn.currentPhase === TurnPhases.MOVE_PHASE;
}

function onMouseMove(pointer) {
    const { turn: currentTurn } = this.state.currentRound;
    const { actor: actorInTurn } = currentTurn;

    if (shouldMouseTrailBeDrawn.call(this, actorInTurn, currentTurn)) {
        const pointerPosition = MapUtils.getTilePositionByCoordinates(pointer.position);

        if (MapUtils.isWithinMap(this.state.map, pointerPosition)) {
            const actorPosition = MapUtils.getTilePositionByCoordinates(actorInTurn.position);

            this.game.pathFinder.findPath(actorPosition, pointerPosition, (path) => {
                drawPointer.call(this, actorInTurn, pointerPosition, path);
                drawTrail.call(this, actorInTurn, actorPosition, pointerPosition, path);
            });
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
     * @constructor
     * @param       {Phaser.State} state
     * @return      {MouseHandler}
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
     */
    activate() {
        this.inputEnabled = true;

        // debounce to prevent clicks while processing previous
        this.mouseDownCallback = debounce(
            onMouseDown.bind(this),
            200,
            { leading: true, trailing: false },
        );
        this.events.onInputDown.add(this.mouseDownCallback, this);
        // should always have the lowest priority when resolving a click target
        this.input.priorityID = 0;

        this.mouseMoveCallback = debounce(
            onMouseMove,
            50,
            { leading: false, trailing: true },
        );
        this.game.input.addMoveCallback(this.mouseMoveCallback, this);

        return this;
    }

    /**
     * Stop listening the mouse events
     */
    deactivate() {
        this.inputEnabled = false;
        this.cleanUp();
        this.events.onInputDown.removeAll(this);
    }

    cleanUp() {
        if (this.mouseTrail) this.mouseTrail.destroy();
        if (this.pointerMark) this.pointerMark.destroy();
    }
}
