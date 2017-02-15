import Command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActor, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class MoveCommand
 * @description A command for moving an actor along a path
 * @extends {Command}
 */
export default class MoveCommand extends Command {
    /**
     * @readonly
     * @memberOf MoveCommand
     */
    get validations() {
        return {
            actor: shouldBeActor,
            path: shouldBeInstanceOf(Array),
        };
    }
    /**
     * Creates an instance of MoveCommand.
     * @param {Actor} actor
     * @param {Array} [path=[]]
     * @memberOf MoveCommand
     */
    constructor(actor, path = []) {
        super(CommandTypes.MOVE_COMMAND, { actor, path });
    }
}
