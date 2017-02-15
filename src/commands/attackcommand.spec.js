import CommandTypes from '../constants/commandtypes';
import AttackCommand from './attackcommand';
import Actor from '../sprites/actor';

jest.mock('../sprites/actor');

describe('AttackCommand', () => {
    describe('Initialization', () => {
        it('should be of type ATTACK_COMMAND', () => {
            const command = new AttackCommand(new Actor(), new Actor());
            expect(command.type).toBe(CommandTypes.ATTACK_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new AttackCommand()).toThrow('actor is missing!');
        });

        it('should require an actor to be an instance of Actor', () => {
            expect(() => new AttackCommand(1)).toThrow('actor is invalid!');
        });

        it('should require target', () => {
            expect(() => new AttackCommand(new Actor())).toThrow('target is missing!');
        });

        it('should require target to be an instance of Actor', () => {
            expect(() => new AttackCommand(new Actor(), 1)).toThrow('target is invalid!');
        });

        it('should not throw an error if all values are valid', () => {
            expect(() => new AttackCommand(new Actor(), new Actor())).not.toThrow();
        });
    });
});
