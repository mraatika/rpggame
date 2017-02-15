import CommandTypes from '../constants/commandtypes';
import MoveCommand from './movecommand';
import Actor from '../sprites/actor';
import CommandDispatcher from './commanddispatcher';

jest.mock('../sprites/actor');
jest.mock('./commanddispatcher');

describe('MoveCommand', () => {
    describe('Initialization', () => {
        it('should be of type MOVE_COMMAND', () => {
            const command = new MoveCommand(new Actor(), []);
            expect(command.type).toBe(CommandTypes.MOVE_COMMAND);
        });
    });

    describe('Validation', () => {
        it('should not require a path', () => {
            expect(() => new MoveCommand(new Actor())).not.toThrow();
        });

        it('should require path to be an array if a value is given', () => {
            expect(() => new MoveCommand(new Actor(), 1)).toThrow();
        });

        it('should require an actor', () => {
            expect(() => new MoveCommand([])).toThrow();
        });

        it('should require an actor to be an instance of Actor', () => {
            expect(() => new MoveCommand(() => {}, [])).toThrow();
        });

        it('should not throw an error if all values are valid', () => {
            expect(() => new MoveCommand(new Actor(), [])).not.toThrow();
        });
    });

    describe('dispatching', () => {
        beforeEach(() => CommandDispatcher.dispatch.mockClear());

        it('should dispatch command if actor has enough movementPoints', () => {
            const actor = new Actor();
            actor.movementPoints = 1;
            const path = [{ x: 0, y: 1 }, { x: 0, y: 1 }];
            const command = new MoveCommand(actor, path);
            command.dispatch();
            expect(CommandDispatcher.dispatch).toHaveBeenCalled();
        });

        it('should not dispatch command if actor does not have enough movementPoints', () => {
            const actor = new Actor();
            actor.movementPoints = 1;
            const path = [{ x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 2 }];
            const command = new MoveCommand(actor, path);
            command.dispatch();
            expect(CommandDispatcher.dispatch).not.toHaveBeenCalled();
        });
    });
});
