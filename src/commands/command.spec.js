import Command from './command';
import CommandDispatcher from './commanddispatcher';
import CommandTypes from '../constants/commandtypes';

jest.mock('./commanddispatcher');

describe('Command', () => {
    describe('initialization', () => {
        it('should require a command type', () => {
            expect(() => new Command()).toThrow('InvalidArgumentsException: Command type is missing!');
        });

        it('should require a correct command type', () => {
            expect(() => new Command('InvalidType')).toThrow('InvalidArgumentsException: Command type is invalid!');
        });

        it('should not throw if type is valid', () => {
            expect(() => new Command(CommandTypes.MOVE_COMMAND)).not.toThrow();
        });

        it('should have no validations', () => {
            const command = new Command(CommandTypes.MOVE_COMMAND);
            const validations = Object.keys(command.validations);
            expect(validations.length).toBe(0);
        });

        it('should assign all props as it\'s own properties', () => {
            const actor = {};
            const path = [];
            const command = new Command(CommandTypes.MOVE_COMMAND, { actor, path });

            expect(command.actor).toBe(actor);
            expect(command.path).toBe(path);
        });
    });

    describe('validation', () => {
        const nameValidator = jest.fn();
        const validators = {
            name: nameValidator,
        };

        class CommandSubclass extends Command {
            get validations() {
                return validators;
            }
        }
        it('should throw if validation of a prop fails', () => {
            nameValidator.mockReturnValueOnce('is missing');
            expect(() => new CommandSubclass(CommandTypes.MOVE_COMMAND, { name: null })).toThrow('name is missing!');
        });

        it('should not throw if validations pass', () => {
            nameValidator.mockReturnValueOnce(undefined);
            expect(() => new CommandSubclass(CommandTypes.MOVE_COMMAND, { name: 'James Bond' })).not.toThrow('name is missing!');
        });
    });

    describe('dispatching', () => {
        const fn = jest.fn();
        class CommandSubclass extends Command {
            prerequisite() { return fn(); }
        }

        beforeEach(() => CommandDispatcher.dispatch.mockClear());

        it('should dispatch if prequisites are fulfilled', () => {
            const command = new CommandSubclass(CommandTypes.MOVE_COMMAND, {});
            fn.mockReturnValueOnce('yes');
            command.dispatch();
            expect(CommandDispatcher.dispatch).toHaveBeenCalled();
        });

        it('should not dispatch if prequisites are not fulfilled', () => {
            const command = new CommandSubclass(CommandTypes.MOVE_COMMAND, {});
            fn.mockReturnValueOnce(0);
            command.dispatch();
            expect(CommandDispatcher.dispatch).not.toHaveBeenCalled();
        });
    });
});
