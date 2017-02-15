import Action from './action';
import ActionTypes from '../constants/actiontypes';
import Events from '../events/events';
import Turn from '../game/turn';
import { shouldBeActor, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class EndTurnAction
 * @description An action representing ending of a phase
 * @extends {Action}
 */
export default class EndTurnAction extends Action {
    /**
     * @readonly
     * @memberOf EndTurnAction
     */
    get validations() {
        return {
            actor: shouldBeActor,
            turn: shouldBeInstanceOf(Turn),
        };
    }

    /**
     * Creates an instance of EndTurnAction.
     * @param {Command} command
     * @param {Turn} turn
     * @memberOf EndTurnAction
     */
    constructor(command, turn) {
        super(ActionTypes.END_TURN_ACTION, { actor: command.actor, turn });
    }

    /**
     * @returns {Boolean}
     * @memberOf EndTurnAction
     */
    execute() {
        this.turn.isDone = true;
        new Events.EndTurnEvent(this.actor).dispatch();
        return true;
    }
}
