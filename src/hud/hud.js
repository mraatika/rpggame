import {Group} from 'phaser';
import EventTypes from 'events/eventtypes';
import TurnPhases from 'common/turnphases';
import EventDispatcher from 'events/eventdispatcher';
import HudPhaseText from 'hud/phasetext';
import StatBoard from 'hud/statboard';
import MessageBoard from 'hud/messageboard';

export default class HUD extends Group {
    /**
     * @constructor
     * @param       {paramType}
     * @return      {HUD}
     */
    constructor(state) {
        super(state.game);

        this.state = state;

        this.fixedToCamera = true;

        this._createPhaseText();
        this._createStatBoard();
        this._createMessageBoard();

        EventDispatcher.add(this._handleEvent, this);
    }

    _createPhaseText() {
        this.phaseText = new HudPhaseText(this.state.game, 0, 0);
        this._updatePhaseText('MOVE');
        this.add(this.phaseText);
    }

    _createStatBoard() {
        this.statBoard = new StatBoard(this.game, 250, this.game.height - 105, this.state.player);
        this.add(this.statBoard);
    }

    _createMessageBoard() {
        this.messageBoard = new MessageBoard(this.game, this.game.width - 350, 0);
        this.add(this.messageBoard);
    }

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

    _updatePhaseText(text) {
        this.phaseText.setText(text);
    }
}