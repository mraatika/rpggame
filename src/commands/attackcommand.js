import Actor from '../sprites/actor';
import Command from './command';
import CommandTypes from '../constants/commandtypes';

const validateSprite = (value) => {
    if (!value) return 'is missing';
    if (!(value instanceof Actor)) return 'is invalid';
    return undefined;
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
            target: validateSprite,
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
