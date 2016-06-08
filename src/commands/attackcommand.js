import Command from 'commands/command';
import CommandTypes from 'commands/commandtypes';
import {Sprite} from 'phaser';

const validateSprite = function(value) {
    if (!value) return 'is missing';
    if (!(value instanceof Sprite)) return 'is invalid';
};

/**
 * @class AttackCommand
 * @description A command for attacking an actor
 * @extends Command
 */
export default class AttackCommand extends Command {

    /**
     * AttackCommand's validations
     * @return {Object}
     */
    get validations() {
        return {
            actor: validateSprite,
            target: validateSprite
        };
    }

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {Actor} target
     * @return      {AttackCommand}
     */
    constructor(actor, target) {
        super(CommandTypes.ATTACK_COMMAND, { actor, target });
    }
}