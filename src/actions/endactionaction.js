import Action from './action';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @class EndActionAction
 * @description An action representing ending of a phase
 * @extends {Action}
 */
export default class EndActionAction extends Action {
    get validations() {
        return {
            actor: shouldBeActor,
        };
    }

    /**
     * Creates an instance of EndActionAction.
     * @param {Command} command
     * @param {TurnPhase} nextPhase
     * @memberOf EndActionAction
     */
    constructor(command, nextPhase) {
        super(ActionTypes.END_ACTION_ACTION, { actor: command.actor, nextPhase });
    }

    /**
     * @returns {Boolean}
     * @memberOf EndActionAction
     */
    execute() {
        const { actor, nextPhase } = this;
        this.isDone = true;
        sendEvent(EventTypes.END_ACTION_EVENT, { actor, phase: nextPhase });
        return true;
    }
}
