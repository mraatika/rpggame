import commandTypes from '../constants/commandtypes';
import endActionCommand from './endactioncommand';
import * as validations from '../utils/validations';

describe('EndActionCommand', () => {
    describe('Initialization', () => {
        it('should be of type END_ACTION_COMMAND', () => {
            validations.shouldBeActor = jest.fn();
            const command = endActionCommand({});
            expect(command.type).toBe(commandTypes.END_ACTION_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            validations.shouldBeActor = jest.fn().mockReturnValueOnce('is missing');
            expect(() => endActionCommand()).toThrow('actor is missing!');
        });
    });
});
