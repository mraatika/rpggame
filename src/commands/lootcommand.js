import command from './command';
import commandTypes from '../constants/commandtypes';
import { shouldBeActorSprite, shouldBeTreasure } from '../utils/validations';

/**
 * @export
 * @name LootCommand
 * Command for looting a treasure
 * @param {ActorSprite} actor
 * @param {Treasure} treasure
 * @returns {LootCommand}
 * @extends {Command}
 */
export default function lootCommand(actor, treasure) {
    const validations = {
        actor: shouldBeActorSprite,
        treasure: shouldBeTreasure,
    };

    return Object.assign(
        command(commandTypes.LOOT_COMMAND, validations, { actor, treasure }),
    );
}
