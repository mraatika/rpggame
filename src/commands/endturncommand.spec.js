import CommandTypes from '../constants/commandtypes';
import EndTurnCommand from './endturncommand';
import * as validations from '../utils/validations';

describe('EndTurnCommand', () => {
    describe('Initialization', () => {
        it('should be of type END_TURN_COMMAND', () => {
            validations.shouldBeActor = jest.fn();
            const command = new EndTurnCommand();
            expect(command.type).toBe(CommandTypes.END_TURN_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActor = jest.fn().mockReturnValueOnce('is missing');
            expect(() => new EndTurnCommand()).toThrow('actor is missing!');
        });
    });
});
