import CommandTypes from '../constants/commandtypes';
import MoveCommand from './movecommand';
import CommandDispatcher from './commanddispatcher';
import * as validations from '../utils/validations';

jest.mock('./commanddispatcher');

describe('MoveCommand', () => {
    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeInstanceOf = jest.fn();
    });

    describe('Initialization', () => {
        it('should be of type MOVE_COMMAND', () => {
            const command = new MoveCommand();
            expect(command.type).toBe(CommandTypes.MOVE_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => new MoveCommand()).toThrow('actor is missing');
        });

        it('should not require a path', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce((value) => {
                if (!value) return 'is missing';
                return undefined;
            });
            expect(() => new MoveCommand({})).not.toThrow();
        });

        it('should validate path if a value is given', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce(() => 'is invalid');
            expect(() => new MoveCommand()).toThrow('path is invalid');
        });
    });

    describe('dispatching', () => {
        beforeEach(() => CommandDispatcher.dispatch.mockClear());

        it('should dispatch command if actor has enough movementPoints', () => {
            const actor = {};
            actor.movementPoints = 1;
            const path = [{ x: 0, y: 1 }, { x: 0, y: 1 }];
            const command = new MoveCommand(actor, path);
            command.dispatch();
            expect(CommandDispatcher.dispatch).toHaveBeenCalled();
        });

        it('should not dispatch command if actor does not have enough movementPoints', () => {
            const actor = {};
            actor.movementPoints = 1;
            const path = [{ x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 2 }];
            const command = new MoveCommand(actor, path);
            command.dispatch();
            expect(CommandDispatcher.dispatch).not.toHaveBeenCalled();
        });
    });
});
