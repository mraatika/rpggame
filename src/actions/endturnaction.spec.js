import endTurnAction from './endturnaction';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import * as validations from '../utils/validations';

jest.mock('../events/eventdispatcher');

describe('ActionendTurnAction', () => {
    function initAction() {
        const actor = {};
        const turn = {};
        return endTurnAction({ actor, turn });
    }

    beforeEach(() => {
        validations.shouldBeActor = jest.fn();
        validations.shouldBeInstanceOf = jest.fn();
        sendEvent.mockClear();
    });

    describe('Validation', () => {
        it('should not throw if validations pass', () => {
            expect(() => endTurnAction({})).not.toThrow();
        });

        it('should validate actor', () => {
            validations.shouldBeActor.mockReturnValueOnce('is missing');
            expect(() => endTurnAction({})).toThrow('actor is missing!');
        });

        it('should validate turn', () => {
            validations.shouldBeInstanceOf.mockReturnValueOnce(() => 'is missing');
            expect(() => endTurnAction({})).toThrow('turn is missing!');
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

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.END_TURN_EVENT);
            expect(props.actor).toBe(action.actor);
        });
    });
});
