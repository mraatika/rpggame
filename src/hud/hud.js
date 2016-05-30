import {Group} from 'phaser';
import HudPhaseText from 'hud/phasetext';
import EventTypes from 'common/eventtypes';
import TurnPhases from 'common/turnphases';
import EventDispatcher from 'common/eventdispatcher';


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

        EventDispatcher.add(this._onCommand, this);
    }

    _createPhaseText() {
        const text = this.phaseText = new HudPhaseText(this.state.game, 0, 0);
        this._updatePhaseText();
        this.add(text);
    }

    _onCommand(event) {
        if (event.type === EventTypes.END_ACTION_EVENT) {
            this._updatePhaseText(event.phase);
        }
    }

    _updatePhaseText(phase) {
        console.log('CURRENT PHASE:', phase);
        this.phaseText.setText(phase === TurnPhases.ACTION_PHASE ? 'ACTION' : 'MOVE');
    }
}