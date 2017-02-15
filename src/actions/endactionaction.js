import Action from './action';
import ActionTypes from '../constants/actiontypes';
import Events from '../events/events';

/**
 * @class EndActionAction
 * @description An action representing ending of a phase
 * @extends {Action}
 */
export default class EndActionAction extends Action {

    get type() {
        return ActionTypes.END_ACTION_ACTION;
    }

    constructor(command, nextPhase) {
        super(command);
        this.nextPhase = nextPhase;
    }

    execute() {
        this.isDone = true;
        new Events.EndActionEvent(this.actor, this.nextPhase).dispatch();
        return true;
    }
}
