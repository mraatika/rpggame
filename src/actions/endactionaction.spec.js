import EndActionAction from './endactionaction';
import EventDispatcher from '../events/eventdispatcher';
import Events from '../events/events';
import * as validations from '../utils/validations';

jest.mock('../events/eventdispatcher');

describe('Action: EndActionAction', () => {
    function initAction() {
        const actor = {};
        return new EndActionAction({ actor });
    }

    beforeEach(() => {
        validations.shouldBeActor = jest.fn();
        EventDispatcher.dispatch.mockClear();
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

            expect(EventDispatcher.dispatch.mock.calls[0][0
            ]).toBeInstanceOf(Events.EndActionEvent);
        });
    });
});
