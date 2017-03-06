import movementAction from './movementaction';
import Mover from '../movement/mover';
import * as validations from '../utils/validations';

jest.mock('../movement/mover');

describe('Action: MovementAction', () => {
    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeInstanceOf = jest.fn();
    });

    describe('Validation', () => {
        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => movementAction({}, {})).toThrow('actor is missing!');
        });

        it('should default path to an empty array', () => {
            const command = { actor: {} };
            let action;
            expect(() => (action = movementAction({}, command))).not.toThrow();
            expect(action.path).toBeInstanceOf(Array);
            expect(action.path.length).toBe(0);
        });

        it('should validate path', () => {
            validations.shouldBeInstanceOf
                .mockReturnValueOnce(() => {})
                .mockReturnValueOnce(() => 'is invalid');
            expect(() => movementAction({}, {})).toThrow('path is invalid!');
        });

        it('should validate game', () => {
            validations.shouldBeInstanceOf
                .mockReturnValueOnce(() => 'is invalid')
                .mockReturnValueOnce(() => {});
            expect(() => movementAction({}, {})).toThrow('game is invalid!');
        });
    });

    describe('Execution', () => {
        const path = [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ];

        function initAction(p = path, movementPoints = 3) {
            const actor = {};
            actor.movementPoints = movementPoints;
            return movementAction({}, { actor, path: p });
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
