import commandTypes from '../constants/commandtypes';
import lootCommand from './lootcommand';
import * as validations from '../utils/validations';

describe('LootCommand', () => {
    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeTreasure = jest.fn();
    });

    describe('Initialization', () => {
        it('should be of type LOOT_COMMAND', () => {
            const command = lootCommand();
            expect(command.type).toBe(commandTypes.LOOT_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => lootCommand()).toThrow('actor is missing');
        });

        it('should validate treasure', () => {
            validations.shouldBeTreasure.mockReturnValueOnce('is missing');
            expect(() => lootCommand()).toThrow('treasure is missing');
        });
    });
});
