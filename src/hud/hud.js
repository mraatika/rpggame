import {Button, Group} from 'phaser';
import EventTypes from 'events/eventtypes';
import TurnPhases from 'common/turnphases';
import EventDispatcher from 'events/eventdispatcher';
import HudPhaseText from 'hud/phasetext';
import StatBoard from 'hud/statboard';
import MessageBoard from 'hud/messageboard';
import Inventory from 'hud/inventory';
import Commands from 'commands/commands';

/**
 * @class HUD
 * @description The hud on top of the tilemap
 * @extends {Phaser.Group}
 */
export default class HUD extends Group {
    /**
     * @constructor
     * @param       {paramType}
     * @return      {HUD}
     */
    constructor(state) {
        super(state.game);

        this.state = state;
        this.game = state.game;

        this.fixedToCamera = true;

        this._createPhaseText();
        this._createActionsBoard();
        this._createMessageBoard();

        EventDispatcher.add(this._handleEvent, this);
    }

    /**
     * Create the text presenting current turn phase
     * @private
     */
    _createPhaseText() {
        this.phaseText = new HudPhaseText(this.state.game, 0, 0);
        this._updatePhaseText('MOVE');
        this.add(this.phaseText);
    }

    /**
     * Create actions board (includes stats board and inventory/action buttons)
     * @private
     */
    _createActionsBoard() {
        this.statBoard = new StatBoard(this.game, 250, this.game.height - 165, this.state.player);

        const endActionButton = new Button(this.game, this.statBoard.x, this.game.height - 60, 'gui', this._onEndActionClick, this, 1, 1, 1, 1);

        const endTurnButton = new Button(this.game, endActionButton.x + endActionButton.width, endActionButton.y, 'gui', this._onEndTurnClick, this);

        this.add(this.statBoard);
        this.add(endActionButton);
        this.add(endTurnButton);
    }

    /**
     * Create the message log board for logging game events
     * @private
     */
    _createMessageBoard() {
        this.messageBoard = new MessageBoard(this.game, this.game.width - 350, 0);
        this.add(this.messageBoard);
    }

    /**
     * Handle eventdispatcher events. Callback for event dispatcher.
     * @private
     * @param   {GameEvent} event
     */
    _handleEvent(event) {
        const handledEventsIfNPC = [EventTypes.START_TURN_EVENT, EventTypes.END_TURN_EVENT];

        this.messageBoard.logEvent(event);

        // only interested in some npc initiated events
        if (event.actor !== this.state.player && handledEventsIfNPC.indexOf(event.type) === -1 ) {
            return;
        }

        switch(event.type) {
        case EventTypes.START_TURN_EVENT:
            this._updatePhaseText(event.actor.isPlayerControlled ? 'MOVE' : 'CPU');
            if (event.actor === this.state.player) {
                this.statBoard.updateAttributes();
            }
            break;
        case EventTypes.END_ACTION_EVENT:
            if (event.actor === this.state.player && event.phase) {
                this._updatePhaseText(event.phase === TurnPhases.ACTION_PHASE ? 'ACTION' : 'MOVE');
            }
            break;
        case EventTypes.MOVE_EVENT:
        case EventTypes.LOOT_EVENT:
            if (event.actor === this.state.player) {
                this.statBoard.updateAttributes();
            }
            break;
        }

    }

    /**
     * Update the phase text
     * @private
     * @param   {string} text
     */
    _updatePhaseText(text) {
        this.phaseText.setText(text);
    }

    /**
     * Callback for end action button. Sends an end action command.
     * @private
     */
    _onEndActionClick() {
        new Commands.EndActionCommand(this.state.player).dispatch();
    }

    /**
     * Callback for end turn button. Sends an end action command.
     * @private
     */
    _onEndTurnClick() {
        new Commands.EndTurnCommand(this.state.player).dispatch();
    }
}