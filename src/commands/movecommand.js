import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import {Sprite} from 'phaser';

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
            actor: function(value) {
                if (!value) return 'is missing';
                if (!(value instanceof Sprite)) return 'is invalid';
            },

            path: function(value) {
                if (value && !(value instanceof Array)) return 'is invalid';
            }
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
