import Command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @class EndTurnCommand
 * @description A command for ending actor's turn.
 * @extends Command
 */
export default class EndTurnCommand extends Command {
     /**
     * @readonly
     * @memberOf EndTurnCommand
     */
    get validations() {
        return {
            actor: shouldBeActor,
        };
    }
    /**
     * Creates an instance of EndTurnCommand.
     * @param {Actor} actor
     * @memberOf EndTurnCommand
     */
    constructor(actor) {
        super(CommandTypes.END_TURN_COMMAND, { actor });
    }
}
