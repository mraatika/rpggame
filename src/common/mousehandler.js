import {debounce} from 'lodash';
import {Point, Sprite} from 'phaser';
import MapUtils from 'common/maputils';
import Commands from 'commands/commands';

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

        //this.scale.setTo(10, 10);

        this.game.add.existing(this);
    }

    /**
     * Start listening to mouse events
     * @return {MouseHandler} this
     */
    activate() {
        this.inputEnabled = true;
        this._mouseDownCallback = debounce(this._onMouseDown, 200, { leading: true, trailing: false });
        this.events.onInputDown.add(this._mouseDownCallback, this);
        this.input.priorityID = 0;
        return this;
    }

    /**
     * Stop listening the mouse events
     */
    deactivate() {
        this.inputEnabled = false;
        this.events.onInputDown.remove(this._mouseDownCallback, this);
    }

    /**
     * On down handler for mouse click
     * @private
     * @param   {MouseHandler} mouseHandler this
     * @param   {Phaser.Pointer} pointer
     */
    _onMouseDown(mouseHandler, pointer) {
        const actorInTurn = this.state.currentRound.turn.actor;

        // do nothing if it's not player's turn
        if (!actorInTurn.isPlayerControlled) return;

        const tile = MapUtils.getTilePositionByCoordinates(pointer.position);

        // if click is not within the map then do nothing
        if (!MapUtils.isWithinMap(this.state.map, tile)) return;

        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(actorInTurn.x, actorInTurn.y));
        const enemyInTile = MapUtils.isObjectOnTile(tile, this.state.actors.children, [ actorInTurn ]);
        const treasureInTile = MapUtils.isObjectOnTile(tile, this.state.treasures.children);

        if (treasureInTile) {
            new Commands.LootCommand(actorInTurn, treasureInTile).dispatch();
        }

        if (MapUtils.isSameTile(tile, actorPosition)) {
            new Commands.EndActionCommand(actorInTurn).dispatch();
            return;
        }

        if (enemyInTile) {
            new Commands.AttackCommand(actorInTurn, enemyInTile).dispatch();
            return;
        }

        this.game.pathFinder.findPath(actorPosition, tile, path => {
            new Commands.MoveCommand(actorInTurn, path).dispatch();
        });
    }
}