import action from './action';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @name EndActionAction
 * Factory function for creating an action of ending a phase
 * @param {Object} command
 * @returns {EndActionAction}
 * @extends {Action}
 */
export default function endActionAction(command = {}) {
    const { actor, nextPhase } = command;

    const validations = {
        actor: shouldBeActor,
    };

    const methods = {
        /**
         * Execute this action
         * @returns {boolean}
         * @memberOf EndActionAction
         */
        execute() {
            this.isDone = true;
            sendEvent(EventTypes.END_ACTION_EVENT, { actor, phase: nextPhase });
            return true;
        },
    };

    return Object.assign(
        action(ActionTypes.END_ACTION_ACTION, validations, { actor, nextPhase }),
        methods,
    );
}
