import Command from './command';
import Actor from '../sprites/actor';
import CommandTypes from './commandtypes';

/**
 * @class EndTurnCommand
 * @description A command for ending actor's turn
 * @extends Command
 */
export default class EndTurnCommand extends Command {
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
     * @return      {EndTurnCommand}
     */
    constructor(actor) {
        super(CommandTypes.END_TURN_COMMAND, { actor });
    }
}
