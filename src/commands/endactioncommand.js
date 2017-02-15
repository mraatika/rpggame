import Command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @class EndActionCommand
 * @description Command ofr ending a turn phase
 * @extends {Command}
 */
export default class EndActionCommand extends Command {
    /**
     * @readonly
     * @memberOf EndActionCommand
     */
    get validations() {
        return {
            actor: shouldBeActor,
        };
    }
    /**
     * Creates an instance of EndActionCommand.
     * @param {Actor} actor
     * @memberOf EndActionCommand
     */
    constructor(actor) {
        super(CommandTypes.END_ACTION_COMMAND, { actor });
    }
}
