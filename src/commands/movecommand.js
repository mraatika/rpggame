import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import {Sprite} from 'phaser';

/**
 * @class MoveCommand
 * @description A command for moving an actor to a point
 * @extends Command
 */
export default class MoveCommand extends Command {

    /**
     * @constructor
     * @param       {Object} props An key-value hash of properties
     *                       {Phaser.Sprite} actor
     *                       {Object} endPoint
     * @return      {MoveCommand}
     */
    constructor(props) {
        super(CommandTypes.MOVE_COMMAND, props);
        this.validations = MoveCommand.validations;
        // validate implicitely
        this.validate();
    }
}

/**
 * Move Command's static validators
 * @type {Object}
 */
MoveCommand.validations = {
    actor: function(value) {
        if (!value) return 'is missing';
        if (!(value instanceof Sprite)) return 'is invalid';
    },

    path: function(value) {
        if (!value) return 'is missing';
        if (!(value instanceof Array)) return 'is invalid';
    }
};