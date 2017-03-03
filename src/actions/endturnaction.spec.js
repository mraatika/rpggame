import EndTurnAction from './endturnaction';
import Events from '../events/events';
import EventDispatcher from '../events/eventdispatcher';
import * as validations from '../utils/validations';

jest.mock('../events/eventdispatcher');

describe('Action: EndTurnAction', () => {
    function initAction() {
        const actor = {};
        const turn = {};
        return new EndTurnAction({ actor }, turn);
    }

    beforeEach(() => {
        validations.shouldBeActor = jest.fn();
        validations.shouldBeInstanceOf = jest.fn();
        EventDispatcher.dispatch.mockClear();
    });

    describe('Validation', () => {
        it('should not throw if validations pass', () => {
            expect(() => new EndTurnAction({})).not.toThrow();
        });

        it('should validate actor', () => {
            validations.shouldBeActor.mockReturnValueOnce('is missing');
            expect(() => new EndTurnAction({})).toThrow('actor is missing!');
        });

        it('should validate turn', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce(() => 'is missing');
            expect(() => new EndTurnAction({})).toThrow('turn is missing!');
        });
    });

    describe('Execution', () => {
        it('should return true if successfull', () => {
            const action = initAction();
            expect(action.execute()).toBeTruthy();
        });

        it('should mark turn done', () => {
            const action = initAction();
            const { turn } = action;
            expect(turn.isDone).toBeFalsy();
            action.execute();
            expect(turn.isDone).toBeTruthy();
        });

        it('should dispatch an end turn event', () => {
            const action = initAction();

            action.execute();

            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.EndTurnEvent);
        });
    });
});
