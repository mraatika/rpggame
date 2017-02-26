import { Group } from 'phaser';
import EventTypes from '../constants/eventtypes';
import TurnPhases from '../constants/turnphases';
import EventDispatcher from '../events/eventdispatcher';
import HudPhaseText from './phasetext';
import StatBoard from './statboard';
import MessageBoard from './messageboard';
import GUIButton from './guibutton';
import Commands from '../commands/commands';
import mount from '../dom/vuerenderer';

/**
 * Callback for end action button. Sends an end action command.
 * @private
 */
function onEndActionClick(player) {
    new Commands.EndActionCommand(player).dispatch();
}

/**
 * Callback for end turn button. Sends an end action command.
 * @private
 */
function onEndTurnClick(player) {
    new Commands.EndTurnCommand(player).dispatch();
}

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

        this.createPhaseText();
        this.createActionsBoard();
        this.createMessageBoard();

        EventDispatcher.add(this.handleEvent, this);
    }

    /**
     * Create the text presenting current turn phase
     * @private
     */
    createPhaseText() {
        this.phaseText = new HudPhaseText(this.state.game, 0, 0);
        this.updatePhaseText('MOVE');
        this.add(this.phaseText);
    }

    /**
     * Create actions board (includes stats board and inventory/action buttons)
     * @private
     */
    createActionsBoard() {
        this.statBoard = new StatBoard(this.game, 250, this.game.height - 165, this.state.player);

        const endActionButton = new GUIButton(
            this.game,
            this.statBoard.x,
            this.game.height - 60,
            'End action',
            () => onEndActionClick(this.state.player),
        );

        const endTurnButton = new GUIButton(
            this.game,
            endActionButton.x + endActionButton.width + 15,
            endActionButton.y,
            'End turn',
            () => onEndTurnClick(this.state.player),
        );

        this.add(this.statBoard);
        this.add(endActionButton);
        this.add(endTurnButton);
    }

    /**
     * Create the message log board for logging game events
     * @private
     */
    createMessageBoard() {
        this.messageBoard = mount(MessageBoard, { x: this.game.width - 350, y: 2 });
    }

    /**
     * Handle eventdispatcher events. Callback for event dispatcher.
     * @private
     * @param   {GameEvent} event
     */
    handleEvent(event) {
        const handledEventsIfNPC = [EventTypes.START_TURN_EVENT, EventTypes.END_TURN_EVENT];

        this.messageBoard.addMessage(event);

        // only interested in some npc initiated events
        if (!event.actor.isPlayerControlled && handledEventsIfNPC.indexOf(event.type) === -1) {
            return;
        }

        switch (event.type) {
        case EventTypes.START_TURN_EVENT:
            this.updatePhaseText(event.actor.isPlayerControlled ? 'MOVE' : 'CPU');
            if (event.actor.isPlayerControlled) {
                this.statBoard.updateAttributes();
            }
            break;
        case EventTypes.END_ACTION_EVENT:
            if (event.actor.isPlayerControlled && event.phase) {
                this.updatePhaseText(event.phase === TurnPhases.ACTION_PHASE ? 'ACTION' : 'MOVE');
            }
            break;
        case EventTypes.MOVE_EVENT:
        case EventTypes.LOOT_EVENT:
        case EventTypes.DAMAGE_EVENT:
            if (event.actor.isPlayerControlled) {
                this.statBoard.updateAttributes();
            }
            break;
        default:
            break;
        }
    }

    /**
     * Update the phase text
     * @private
     * @param   {string} text
     */
    updatePhaseText(text) {
        this.phaseText.setText(text);
    }
}
