import CommandTypes from '../constants/commandtypes';
import MoveCommand from './movecommand';
import Actor from '../sprites/actor';

jest.mock('../sprites/actor');

describe('MoveCommand', () => {
    describe('Initialization', () => {
        it('should be of type MOVE_COMMAND', () => {
            const command = new MoveCommand(new Actor(), []);
            expect(command.type).toBe(CommandTypes.MOVE_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should not require a path', () => {
            expect(() => new MoveCommand(new Actor())).not.toThrow();
        });

        it('should require path to be an array if a value is given', () => {
            expect(() => new MoveCommand(new Actor(), 1)).toThrow();
        });

        it('should require an actor', () => {
            expect(() => new MoveCommand([])).toThrow();
        });

        it('should require an actor to be an instance of Actor', () => {
            expect(() => new MoveCommand(() => {}, [])).toThrow();
        });

        it('should not throw an error if all values are valid', () => {
            expect(() => new MoveCommand(new Actor(), [])).not.toThrow();
        });
    });
});