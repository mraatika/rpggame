import Action from 'actions/action';
import ActionTypes from 'actions/actiontypes';
import EventDispatcher from 'common/eventdispatcher';
import EventTypes from 'common/eventtypes';

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
        EventDispatcher.dispatch(EventTypes.END_ACTION_EVENT, { actor: this.actor, phase: this.nextPhase });
        return true;
    }
}