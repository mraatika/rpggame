import Game from '../game/game';
import MovementAction from './movementaction';
import Actor from '../sprites/actor';
import Mover from '../movement/mover';

jest.mock('../movement/mover');
jest.mock('../sprites/actor');
jest.mock('../game/game');

describe('Action: MovementAction', () => {
    describe('Initialization', () => {
        it('should have path property by default', () => {
            const action = new MovementAction(new Game(), { actor: new Actor() });
            expect(action.path).toBeInstanceOf(Array);
            expect(action.path.length).toBe(0);
        });

        it('should require game to be an instance of game', () => {
            expect(() => new MovementAction({}, {})).toThrow('game is invalid!');
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            const command = {};
            expect(() => new MovementAction(new Game(), command)).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of actor', () => {
            expect(() => new MovementAction(new Game(), { actor: 1 })).toThrow('actor is invalid!');
        });

        it('should default path to an empty array', () => {
            const command = { actor: new Actor() };
            let action;
            expect(() => (action = new MovementAction(new Game(), command))).not.toThrow();
            expect(action.path).toBeInstanceOf(Array);
            expect(action.path.length).toBe(0);
        });

        it('should require path to be an array', () => {
            const command = { actor: new Actor(), path: 1 };
            expect(() => new MovementAction(new Game(), command)).toThrow('path is invalid!');
        });
    });

    describe('Execution', () => {
        const path = [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ];

        function initAction(p = path, movementPoints = 3) {
            const actor = new Actor();
            actor.movementPoints = movementPoints;
            return new MovementAction(new Game(), { actor, path: p });
        }

        it('should not be successfull if path is empty', () => {
            const action = initAction([]);
            expect(action.execute()).toBeFalsy();
        });

        it('should not be successfull if path contains only one point (current position)', () => {
            const action = initAction([{ x: 1, y: 1 }]);
            expect(action.execute()).toBeFalsy();
        });

        it('should not be successfull if the actor does not have enough movement points', () => {
            const longerPath = [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
            ];
            const action = initAction(longerPath, 1);
            expect(action.execute()).toBeFalsy();
        });

        it('should mark action as pending when it is started to be executed', () => {
            const action = initAction();

            action.execute();

            expect(action.pending).toBeTruthy();
        });

        it('should reduce actor\'s movementpoints by path.length -1', () => {
            const action = initAction();
            const initialMovementPoints = action.actor.movementPoints;
            const expectedMovementPoints = initialMovementPoints - (path.length - 1);

            action.execute();

            expect(action.actor.movementPoints).toBe(expectedMovementPoints);
        });

        it('should use mover to move actor along the path', () => {
            const action = initAction();

            action.execute();

            expect(Mover.prototype.movePath).toHaveBeenCalled();
            // expect call's first argument to be array
            expect(Mover.prototype.movePath.mock.calls[0][0]).toBeInstanceOf(Array);
            // expect call's first argument to contain one point
            expect(Mover.prototype.movePath.mock.calls[0][0].length).toBe(1);
            // expect call's first argument to contain path's second entry (target point)
            expect(Mover.prototype.movePath.mock.calls[0][0]).toContain(path[1]);
        });

        it('should mark action as not pending when mover finishes', () => {
            const action = initAction();

            // invoke callback
            Mover.prototype.movePath = jest.fn((p, cb) => cb());

            action.execute();

            expect(action.pending).toBeFalsy();
        });

        it('should return true when action is successfull', () => {
            const action = initAction();
            expect(action.execute()).toBeTruthy();
        });
    });
});
