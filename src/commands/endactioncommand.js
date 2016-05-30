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
     * @constructor
     * @param       {Object} props An key-value hash of properties
     *                       {Phaser.Sprite} actor
     * @return      {EndActionCommand}
     */
    constructor(props) {
        super(CommandTypes.END_ACTION_COMMAND, props);
        this.validations = EndActionCommand.validations;
        // validate implicitely
        this.validate();
    }
}

/**
 * Command's static validators
 * @type {Object}
 */
EndActionCommand.validations = {
    actor: function(value) {
        if (!value) return 'is missing';
        if (!(value instanceof Sprite)) return 'is invalid';
    }
};