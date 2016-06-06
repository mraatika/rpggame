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
     * @constructor
     * @param       {Object} props An key-value hash of properties
     *                       {Actor} actor
     *                       {Treasure} treasure
     * @return      {LootCommand}
     */
    constructor(props) {
        super(CommandTypes.LOOT_COMMAND, props);
        this.validations = LootCommand.validations;
        // validate implicitely
        this.validate();
    }
}

/**
 * Loot command's static validators
 * @static
 * @type {Object}
 */
LootCommand.validations = {
    actor: value => {
        if (!value) return 'is missing!';
        if (!(value instanceof Actor)) return 'is invalid';
    },
    treasure: value => {
        if (!value) return 'is missing';
        if (!(value instanceof Treasure)) return 'is invalid';
    }
};