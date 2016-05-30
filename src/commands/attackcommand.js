import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import {Sprite} from 'phaser';

/**
 * @class AttackCommand
 * @description A command for attacking an actor
 * @extends Command
 */
export default class AttackCommand extends Command {

    /**
     * @constructor
     * @param       {Object} props An key-value hash of properties
     *                       {Phaser.Sprite} actor
     *                       {Phaser.Sprite} target
     * @return      {AttackCommand}
     */
    constructor(props) {
        super(CommandTypes.ATTACK_COMMAND, props);
        this.validations = AttackCommand.validations;
        // validate implicitely
        this.validate();
    }
}

const validateSprite = function(value) {
    if (!value) return 'is missing';
    if (!(value instanceof Sprite)) return 'is invalid';
};

/**
 * Attack command's static validators
 * @static
 * @type {Object}
 */
AttackCommand.validations = {
    actor: validateSprite,
    target: validateSprite
};