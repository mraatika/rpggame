import { debounce } from 'lodash';
import { Sprite } from 'phaser';
import MapUtils from '../utils/maputils';
import Commands from '../commands/commands';
import EnemyCard from '../sprites/enemycard';
import TurnPhases from '../constants/turnphases';

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
            this.onMouseDown,
            200,
            { leading: true, trailing: false },
        );
        this.events.onInputDown.add(this.mouseDownCallback, this);
        // should always have the lowest priority when resolving a click target
        this.input.priorityID = 0;
        return this;
    }

    /**
     * Stop listening the mouse events
     */
    deactivate() {
        this.inputEnabled = false;
        this.events.onInputDown.remove(this.mouseDownCallback, this);
    }

    /**
     * On down handler for mouse click.
     * Debounced version of this will be send as a parameter to Phaser.
     * @private
     * @param   {MouseHandler} mouseHandler this
     * @param   {Phaser.Pointer} pointer
     */
    onMouseDown(mouseHandler, pointer) {
        const actorInTurn = this.state.currentRound.turn.actor;
        const tile = MapUtils.getTilePositionByCoordinates(pointer.position);
        const enemyInTile = MapUtils.isObjectOnTile(
            tile,
            this.state.actors.children,
            [actorInTurn],
        );

        // display enemy details card if clicked with left button
        if (enemyInTile && !pointer.rightButton.isDown) {
            this.showEnemyCard(actorInTurn, enemyInTile);
            return;
        }

        // do nothing if it's not player's turn
        if (!actorInTurn.isPlayerControlled) return;

        // if click is not within the map then do nothing
        if (!MapUtils.isWithinMap(this.state.map, tile)) return;

        const treasureInTile = MapUtils.isObjectOnTile(tile, this.state.treasures.children);
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

        if (enemyInTile && pointer.rightButton.isDown) {
            new Commands.AttackCommand(actorInTurn, enemyInTile).dispatch();
            return;
        }

        this.game.pathFinder.findPath(actorPosition, tile, (path) => {
            new Commands.MoveCommand(actorInTurn, path).dispatch();
        });
    }

    /**
     * Display enemy details card
     * @private
     * @param   {Actor} actor
     * @param   {Enemy} enemy
     */
    showEnemyCard(actor, enemy) {
        const canAttackEnemy = this.state.currentRound.turn.currentPhase ===
            TurnPhases.ACTION_PHASE && MapUtils.isOnSurroundingTile(actor, enemy);

        if (this.enemyCard) {
            this.enemyCard.kill();
        }

        this.enemyCard = new EnemyCard(this.state, enemy, canAttackEnemy).show();
    }
}
