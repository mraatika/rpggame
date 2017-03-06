import command from './command';
import commandTypes from '../constants/commandtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @name EndActionCommand
 * Command for ending a turn phase
 * @param {Actor} actor
 * @returns {EndActionCommand}
 * @extends {Command}
 */
export default function endActionCommand(actor) {
    const validations = {
        actor: shouldBeActor,
    };

    return Object.assign(
        command(commandTypes.END_ACTION_COMMAND, validations, { actor }),
    );
}
