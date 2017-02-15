import Actor from '../sprites/actor';
import Command from './command';
import CommandTypes from './commandtypes';

/**
 * @class EndActionCommand
 * @description A command for end a turn phase
 * @extends Command
 */
export default class EndActionCommand extends Command {
    /**
     * Command's validators
     * @return {Object}
     */
    get validations() {
        return {
            actor(value) {
                if (!value) return 'is missing';
                if (!(value instanceof Actor)) return 'is invalid';
                return undefined;
            },
        };
    }

    /**
     * @constructor
     * @param       {Actor} actor
     * @return      {EndActionCommand}
     */
    constructor(actor) {
        super(CommandTypes.END_ACTION_COMMAND, { actor });
    }
}
