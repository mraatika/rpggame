import Command from './command';
import CommandTypes from '../constants/commandtypes';
import Treasure from '../sprites/treasure';
import { shouldBeActor, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class LootCommand
 * @description Command for looting a treasure
 * @extends {Command}
 */
export default class LootCommand extends Command {
    /**
     * @readonly
     * @memberOf LootCommand
     */
    get validations() {
        return {
            actor: shouldBeActor,
            treasure: shouldBeInstanceOf(Treasure),
        };
    }
    /**
     * Creates an instance of LootCommand.
     * @param {Actor} actor
     * @param {Treasure} treasure
     * @memberOf LootCommand
     */
    constructor(actor, treasure) {
        super(CommandTypes.LOOT_COMMAND, { actor, treasure });
    }
}
