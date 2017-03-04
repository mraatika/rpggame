import EndActionAction from './endactionaction';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import * as validations from '../utils/validations';

jest.mock('../events/eventdispatcher');

describe('Action: EndActionAction', () => {
    function initAction() {
        const actor = {};
        return new EndActionAction({ actor });
    }

    beforeEach(() => {
        validations.shouldBeActor = jest.fn();
        sendEvent.mockClear();
    });

    describe('Validation', () => {
        it('should not throw if validations pass', () => {
            expect(() => new EndActionAction({})).not.toThrow();
        });

        it('should validate actor', () => {
            validations.shouldBeActor.mockReturnValueOnce('is missing');
            expect(() => new EndActionAction({})).toThrow('actor is missing!');
        });
    });

    describe('Execution', () => {
        it('should return true if successfull', () => {
            const action = initAction();
            expect(action.execute()).toBeTruthy();
        });

        it('should mark action done', () => {
            const action = initAction();
            action.execute();
            expect(action.isDone).toBeTruthy();
        });

        it('should dispatch an end action event', () => {
            const action = initAction();

            action.execute();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.END_ACTION_EVENT);
            expect(props.actor).toBe(action.actor);
        });
    });
});
