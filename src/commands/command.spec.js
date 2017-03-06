import createCommand from './command';
import CommandDispatcher from './commanddispatcher';
import commandTypes from '../constants/commandtypes';

jest.mock('./commanddispatcher');

describe('Command', () => {
    describe('initialization', () => {
        it('should require a command type', () => {
            expect(() => createCommand()).toThrow('InvalidArgumentsException: Command type is missing!');
        });

        it('should require a correct command type', () => {
            expect(() => createCommand('InvalidType')).toThrow('InvalidArgumentsException: Command type is invalid!');
        });

        it('should not throw if type is valid', () => {
            expect(() => createCommand(commandTypes.MOVE_COMMAND)).not.toThrow();
        });

        it('should assign all props as it\'s own properties', () => {
            const actor = {};
            const path = [];
            const command = createCommand(commandTypes.MOVE_COMMAND, {}, { actor, path });

            expect(command.actor).toBe(actor);
            expect(command.path).toBe(path);
        });
    });

    describe('validation', () => {
        it('should throw if validation of a prop fails', () => {
            const validations = { name: jest.fn().mockReturnValue('is missing') };
            expect(() => createCommand(commandTypes.MOVE_COMMAND, validations, { name: null })).toThrow('name is missing!');
        });

        it('should not throw if validations pass', () => {
            const validations = { name: jest.fn() };
            expect(() => createCommand(commandTypes.MOVE_COMMAND, validations, { name: 'James Bond' })).not.toThrow('name is missing!');
        });
    });
});
