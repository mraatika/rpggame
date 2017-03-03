import Command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActorSprite, shouldBeTreasure } from '../utils/validations';

/**
 * @export
 * @class LootCommand
 * @description Command for looting a treasure
 * @extends {Command}
 */
export default class LootCommand extends Command {
    /**
     * @readonly
     * @memberOf LootCommand
     */
    get validations() {
        return {
            actor: shouldBeActorSprite,
            treasure: shouldBeTreasure,
        };
    }
    /**
     * Creates an instance of LootCommand.
     * @param {Actor} actor
     * @param {Treasure} treasure
     * @memberOf LootCommand
     */
    constructor(actor, treasure) {
        super(CommandTypes.LOOT_COMMAND, { actor, treasure });
    }
}
