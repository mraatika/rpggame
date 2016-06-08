import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import Actor from 'sprites/actor';
import Treasure from 'sprites/treasure';

/**
 * @class LootCommand
 * @description A command for looting a treasure
 * @extends Command
 */
export default class LootCommand extends Command {

    /**
     * Loot command's validators
     * @return {Object}
     */
    get validations() {
        return {
            actor: value => {
                if (!value) return 'is missing!';
                if (!(value instanceof Actor)) return 'is invalid';
            },
            treasure: value => {
                if (!value) return 'is missing';
                if (!(value instanceof Treasure)) return 'is invalid';
            }
        };
    }

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {Treasure} treasure
     * @return      {LootCommand}
     */
    constructor(actor, treasure) {
        super(CommandTypes.LOOT_COMMAND, { actor, treasure });
    }
}