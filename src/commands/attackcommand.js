import Command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @class AttackCommand
 * @description A command for attacking a target
 * @extends {Command}
 */
export default class AttackCommand extends Command {
    /**
     * @readonly
     * @memberOf AttackCommand
     */
    get validations() {
        return {
            actor: shouldBeActor,
            target: shouldBeActor,
        };
    }
    /**
     * Creates an instance of AttackCommand.
     * @param {Actor} actor
     * @param {Actor} target
     * @memberOf AttackCommand
     */
    constructor(actor, target) {
        super(CommandTypes.ATTACK_COMMAND, { actor, target });
    }
}
