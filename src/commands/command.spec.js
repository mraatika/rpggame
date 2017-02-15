import Command from './command';
import CommandTypes from '../constants/commandtypes';

describe('Command', () => {
    describe('Initialization', () => {
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

    describe('Validation', () => {
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
});
