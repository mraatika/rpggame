import EndActionAction from './endactionaction';
import EventDispatcher from '../events/eventdispatcher';
import Events from '../events/events';
import Actor from '../sprites/actor';

jest.mock('../sprites/actor');
jest.mock('../game/turn');
jest.mock('../events/eventdispatcher');

describe('Action: EndActionAction', () => {
    function initAction() {
        const actor = new Actor();
        return new EndActionAction({ actor });
    }

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new EndActionAction({})).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of actor', () => {
            expect(() => new EndActionAction({ actor: 1 })).toThrow('actor is invalid!');
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
