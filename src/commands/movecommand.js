import Actor from '../sprites/actor';
import Command from './command';
import CommandTypes from '../constants/commandtypes';

/**
 * @class MoveCommand
 * @description A command for moving an actor along a path
 * @extends Command
 */
export default class MoveCommand extends Command {

    /**
     * Move Command's validators
     * @return {Object}
     */
    get validations() {
        return {
            actor(value) {
                if (!value) return 'is missing';
                if (!(value instanceof Actor)) return 'is invalid';
                return undefined;
            },
            path(value) {
                if (value && !(value instanceof Array)) return 'is invalid';
                return undefined;
            },
        };
    }

    /**
     * @constructor
     * @param   {Actor}  actor
     * @param   {Array}  [path=[]]
     * @return  {MoveCommand}
     */
    constructor(actor, path = []) {
        super(CommandTypes.MOVE_COMMAND, { actor, path });
    }
}
