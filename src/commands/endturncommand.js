import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import {Sprite} from 'phaser';

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
            actor: function(value) {
                if (!value) return 'is missing';
                if (!(value instanceof Sprite)) return 'is invalid';
            }
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
