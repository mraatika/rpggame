import command from './command';
import commandTypes from '../constants/commandtypes';
import { shouldBeActor } from '../utils/validations';

/**
 * @export
 * @name EndActionCommand
 * Command for ending a turn
 * @param {Actor} actor
 * @returns {EndTurnCommand}
 * @extends {Command}
 */
export default function endTurnCommand(actor) {
    const validations = {
        actor: shouldBeActor,
    };

    return Object.assign(
        command(commandTypes.END_TURN_COMMAND, validations, { actor }),
    );
}
