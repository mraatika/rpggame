import {expect} from 'chai';
import Command from '../../src/commands/command';
import CommandTypes from '../../src/commands/commandtypes';

describe('Command', function () {
    describe('Initialization', function () {
        it('should throw error if type is invalid', function () {
            expect(function() {
                new Command('ASOJD');
            }).to.throw('InvalidArgumentsException: Type invalid or missing!');
        });

        it('should not throw error with a correct type', function () {
            expect(function() {
                new Command(CommandTypes.MOVE_COMMAND);
            }).not.to.throw();
        });

        it('should save given props', function () {
            const p = {x: 1, y: 2 };
            const command = new Command(CommandTypes.MOVE_COMMAND, {
                endPoint: p
            });

            expect(command.endPoint).to.equal(p);
        });
    });

    describe('Validation', function () {
        it('should throw an error if a required attribute is missing', function () {
            const command = new Command(CommandTypes.MOVE_COMMAND);

            command.validations.endPoint = function() {
                return 'is required';
            };

            expect(() => {
                command.validate();
            }).to.throw('ValidationError: endPoint is required!');
        });

        it('should not throw an error if required attribute is valid', function () {
            const command = new Command(CommandTypes.MOVE_COMMAND, {
                endPoint: 2
            });

            command.validations.endPoint = () => {};

            expect(() => { command.validate(); }).not.to.throw();
        });
    });
});