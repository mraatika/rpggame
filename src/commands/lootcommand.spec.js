import CommandTypes from '../constants/commandtypes';
import LootCommand from './lootcommand';
import Actor from '../sprites/actor';
import Treasure from '../sprites/treasure';

jest.mock('../sprites/actor');
jest.mock('../sprites/treasure');

describe('LootCommand', () => {
    describe('Initialization', () => {
        it('should be of type LOOT_COMMAND', () => {
            const command = new LootCommand(new Actor(), new Treasure());
            expect(command.type).toBe(CommandTypes.LOOT_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should require treasure to be an instance of Treasure', () => {
            expect(() => new LootCommand(new Actor(), 1)).toThrow();
        });

        it('should require an actor', () => {
            expect(() => new LootCommand([])).toThrow();
        });

        it('should require an actor to be an instance of Actor', () => {
            expect(() => new LootCommand(() => {})).toThrow();
        });

        it('should not throw an error if all values are valid', () => {
            expect(() => new LootCommand(new Actor(), new Treasure())).not.toThrow();
        });
    });
});
