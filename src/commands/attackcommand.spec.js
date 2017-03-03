import CommandTypes from '../constants/commandtypes';
import AttackCommand from './attackcommand';
import * as validations from '../utils/validations';

describe('AttackCommand', () => {
    beforeEach(() => (validations.shouldBeActorSprite = jest.fn()));

    describe('Initialization', () => {
        it('should be of type ATTACK_COMMAND', () => {
            const command = new AttackCommand({}, {});
            expect(command.type).toBe(CommandTypes.ATTACK_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => new AttackCommand()).toThrow('actor is missing!');
        });

        it('should require target', () => {
            validations.shouldBeActorSprite
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce('is missing');
            expect(() => new AttackCommand()).toThrow('target is missing!');
        });
    });
});
