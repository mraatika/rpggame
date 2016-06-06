import {Group} from 'phaser';
import EventTypes from 'common/eventtypes';
import TurnPhases from 'common/turnphases';
import EventDispatcher from 'common/eventdispatcher';
import HudPhaseText from 'hud/phasetext';
import StatBoard from 'hud/statboard';


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

        EventDispatcher.add(this._handleEvent, this);
    }

    _createPhaseText() {
        this.phaseText = new HudPhaseText(this.state.game, 0, 0);
        this._updatePhaseText();
        this.add(this.phaseText);
    }

    _createStatBoard() {
        this.statBoard = new StatBoard(this.game, 250, this.game.height - 105, this.state.player);
        this.add(this.statBoard);
    }

    _handleEvent(event) {
        // not intrested in npc actions and events
        if (event.actor !== this.state.player) return;

        switch(event.type) {
        case EventTypes.END_ACTION_EVENT:
            this._updatePhaseText(event.phase);
            break;
        case EventTypes.ATTRIBUTE_CHANGE_EVENT:
        case EventTypes.MOVE_EVENT:
        case EventTypes.LOOT_EVENT:
            this.statBoard.updateAttributes();
            break;
        }

    }

    _updatePhaseText(phase) {
        this.phaseText.setText(phase === TurnPhases.ACTION_PHASE ? 'ACTION' : 'MOVE');
    }
}