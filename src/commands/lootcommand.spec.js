import CommandTypes from '../constants/commandtypes';
import LootCommand from './lootcommand';
import * as validations from '../utils/validations';

describe('LootCommand', () => {
    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeInstanceOf = jest.fn();
    });

    describe('Initialization', () => {
        it('should be of type LOOT_COMMAND', () => {
            const command = new LootCommand();
            expect(command.type).toBe(CommandTypes.LOOT_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => new LootCommand()).toThrow('actor is missing');
        });

        it('should validate treasure', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce(() => 'is missing');
            expect(() => new LootCommand()).toThrow('treasure is missing');
        });
    });
});
