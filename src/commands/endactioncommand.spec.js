import CommandTypes from '../constants/commandtypes';
import EndActionCommand from './endactioncommand';
import Actor from '../sprites/actor';

jest.mock('../sprites/actor');

describe('EndActionCommand', () => {
    describe('Initialization', () => {
        it('should be of type END_ACTION_COMMAND', () => {
            const command = new EndActionCommand(new Actor());
            expect(command.type).toBe(CommandTypes.END_ACTION_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new EndActionCommand()).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of Actor', () => {
            expect(() => new EndActionCommand(1)).toThrow('actor is invalid!');
        });

        it('should not throw an error if all values are valid', () => {
            expect(() => new EndActionCommand(new Actor())).not.toThrow();
        });
    });
});
