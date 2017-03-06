import commandTypes from '../constants/commandtypes';
import moveCommand from './movecommand';
import * as validations from '../utils/validations';

jest.mock('./commanddispatcher');

describe('MoveCommand', () => {
    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeInstanceOf = jest.fn();
    });

    describe('Initialization', () => {
        it('should be of type MOVE_COMMAND', () => {
            const command = moveCommand();
            expect(command.type).toBe(commandTypes.MOVE_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => moveCommand()).toThrow('actor is missing');
        });

        it('should not require a path', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce((value) => {
                if (!value) return 'is missing';
                return undefined;
            });
            expect(() => moveCommand({})).not.toThrow();
        });

        it('should validate path if a value is given', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce(() => 'is invalid');
            expect(() => moveCommand()).toThrow('path is invalid');
        });
    });

    describe('Checking the prerequisite', () => {
        it('should dispatch command if actor has enough movementPoints', () => {
            const actor = {};
            actor.movementPoints = 1;
            const path = [{ x: 0, y: 1 }, { x: 0, y: 1 }];
            const command = moveCommand(actor, path);
            expect(command.prerequisite()).toBe(true);
        });

        it('should not dispatch command if actor does not have enough movementPoints', () => {
            const actor = {};
            actor.movementPoints = 1;
            const path = [{ x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 2 }];
            const command = moveCommand(actor, path);
            expect(command.prerequisite()).toBe(false);
        });
    });
});
