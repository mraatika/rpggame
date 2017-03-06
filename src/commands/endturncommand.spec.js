import commandTypes from '../constants/commandtypes';
import endTurnCommand from './endturncommand';
import * as validations from '../utils/validations';

describe('EndTurnCommand', () => {
    describe('Initialization', () => {
        it('should be of type END_TURN_COMMAND', () => {
            validations.shouldBeActor = jest.fn();
            const command = endTurnCommand();
            expect(command.type).toBe(commandTypes.END_TURN_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActor = jest.fn().mockReturnValueOnce('is missing');
            expect(() => endTurnCommand()).toThrow('actor is missing!');
        });
    });
});
