import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import {Sprite} from 'phaser';

/**
 * @class EndActionCommand
 * @description A command for moving an actor to a point
 * @extends Command
 */
export default class EndActionCommand extends Command {
    /**
     * Command's validators
     * @return {Object}
     */
    get validations() {
        return {
            actor: function(value) {
                if (!value) return 'is missing';
                if (!(value instanceof Sprite)) return 'is invalid';
            }
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
