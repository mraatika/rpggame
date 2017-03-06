import command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActorSprite } from '../utils/validations';

/**
 * @export
 * @name AttackCommand
 * A command for attacking a target
 * @param {ActorSprite} actor
 * @param {ActorSprite} target
 * @returns {AttackCommand}
 * @extends {Command}
 */
export default function attackCommand(actor, target) {
    const validations = {
        actor: shouldBeActorSprite,
        target: shouldBeActorSprite,
    };

    return Object.assign(
        command(CommandTypes.ATTACK_COMMAND, validations, { actor, target }),
    );
}
