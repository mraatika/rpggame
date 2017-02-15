import EndTurnAction from './endturnaction';
import Actor from '../sprites/actor';
import Turn from '../game/turn';
import Events from '../events/events';
import EventDispatcher from '../events/eventdispatcher';

jest.mock('../game/turn');
jest.mock('../sprites/actor');
jest.mock('../events/eventdispatcher');

describe('Action: EndTurnAction', () => {
    function initAction() {
        const actor = new Actor();
        const turn = new Turn();
        return new EndTurnAction({ actor }, turn);
    }

    beforeEach(() => EventDispatcher.dispatch.mockClear());

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new EndTurnAction({})).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of actor', () => {
            expect(() => new EndTurnAction({ actor: 1 })).toThrow('actor is invalid!');
        });

        it('should require a turn', () => {
            const command = { actor: new Actor() };
            expect(() => new EndTurnAction(command)).toThrow('turn is missing!');
        });

        it('should require turn be an instanceof Turn', () => {
            const command = { actor: new Actor() };
            expect(() => new EndTurnAction(command, 1)).toThrow('turn is invalid!');
        });

        it('should not throw if validations pass', () => {
            const command = { actor: new Actor() };
            expect(() => new EndTurnAction(command, new Turn())).not.toThrow();
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
