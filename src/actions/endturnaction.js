import Action from 'actions/action';
import ActionTypes from 'actions/actiontypes';
import Events from 'events/events';

/**
 * @class EndTurnAction
 * @description An action representing ending of a phase
 * @extends {Action}
 */
export default class EndTurnAction extends Action {

    get type() {
        return ActionTypes.END_TURN_ACTION;
    }

    constructor(command, turn) {
        super(command);
        this.turn = turn;
    }

    execute() {
        this.turn.isDone = true;
        new Events.EndTurnEvent(this.actor).dispatch();
        return true;
    }
}