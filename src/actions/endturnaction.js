import action from './action';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @name EndTurnAction
 * An action of ending a turn
 * @param {Object} command
 * @returns {EndTurnAction}
 * @extends {Action}
 */
export default function endTurnAction(command = {}) {
    const { actor, turn } = command;

    const validations = {
        actor: shouldBeActor,
        turn: (value) => {
            if (!value) return 'is missing';
            return undefined;
        },
    };

    const methods = {
        /**
         * @returns {Boolean}
         * @memberOf EndTurnAction
         */
        execute() {
            turn.isDone = true;
            sendEvent(EventTypes.END_TURN_EVENT, { actor });
            return true;
        },
    };

    return Object.assign(
        action(ActionTypes.END_TURN_ACTION, validations, { actor, turn }),
        methods,
    );
}
