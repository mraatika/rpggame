import CommandTypes from '../constants/commandtypes';
import EndTurnCommand from './endturncommand';
import Actor from '../sprites/actor';

jest.mock('../sprites/actor');

describe('EndTurnCommand', () => {
    describe('Initialization', () => {
        it('should be of type END_TURN_COMMAND', () => {
            const command = new EndTurnCommand(new Actor());
            expect(command.type).toBe(CommandTypes.END_TURN_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new EndTurnCommand()).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of Actor', () => {
            expect(() => new EndTurnCommand(1)).toThrow('actor is invalid!');
        });

        it('should not throw an error if all values are valid', () => {
            expect(() => new EndTurnCommand(new Actor())).not.toThrow();
        });
    });
});
