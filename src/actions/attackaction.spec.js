import AttackAction from './attackaction';
import Actor from '../sprites/actor';
import MapUtils from '../utils/maputils';
import Events from '../events/events';
import EventDispatcher from '../events/eventdispatcher';

jest.mock('../sprites/actor');
jest.mock('../utils/maputils');
jest.mock('../events/eventdispatcher');

describe('Action: AttackAction', () => {
    function initAction() {
        const actor = new Actor();
        const target = new Actor();
        target.events = {
            onKilled: {
                add: jest.fn(),
            },
        };
        return new AttackAction({ actor, target });
    }

    beforeEach(() => EventDispatcher.dispatch.mockClear());

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new AttackAction({})).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of Actor', () => {
            expect(() => new AttackAction({ actor: 1 })).toThrow('actor is invalid!');
        });

        it('should require a target', () => {
            expect(() => new AttackAction({ actor: new Actor() })).toThrow('target is missing!');
        });

        it('should require target be an instanceof Actor', () => {
            expect(() => new AttackAction({ actor: new Actor(), target: 1 })).toThrow('target is invalid!');
        });

        it('should not throw if validations pass', () => {
            const command = { actor: new Actor(), target: new Actor() };
            expect(() => new AttackAction(command)).not.toThrow();
        });
    });

    describe('Execution', () => {
        it('should not be succesfull if target is not on a surrounding tile', () => {
            const action = initAction();
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            expect(action.execute()).toBeFalsy();
        });

        it('should dispatch an attack event', () => {
            const action = initAction();
            const attackValue = 1;

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            action.actor.throwAttack.mockReturnValueOnce(attackValue);

            action.execute();

            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.AttackEvent);
        });

        it('should be successfull but not reach the defence phase if attack is zero', () => {
            const action = initAction();
            const attackValue = 0;

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            action.actor.throwAttack.mockReturnValueOnce(attackValue);

            const result = action.execute();

            expect(result).toBeTruthy();
            expect(action.target.throwDefence).not.toHaveBeenCalled();
        });

        it('should dispatch an defend event', () => {
            const action = initAction();
            const { actor, target } = action;
            const defenceValue = 1;

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            actor.throwAttack.mockReturnValueOnce(1);
            target.throwDefence.mockReturnValueOnce(defenceValue);

            const result = action.execute();

            expect(result).toBeTruthy();
            expect(EventDispatcher.dispatch.mock.calls[1][0]).toBeInstanceOf(Events.DefendEvent);
        });

        it('should dispatch a damage event and cause damage to target if defence is less than attack', () => {
            const action = initAction();
            const { actor, target } = action;
            const attackValue = 2;
            const defenceValue = 1;
            const damage = attackValue - defenceValue;

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            actor.throwAttack.mockReturnValueOnce(attackValue);
            target.throwDefence.mockReturnValueOnce(defenceValue);

            const result = action.execute();

            expect(result).toBeTruthy();
            expect(EventDispatcher.dispatch.mock.calls[2][0]).toBeInstanceOf(Events.DamageEvent);

            expect(target.damage).toHaveBeenCalledWith(damage);
        });

        it('should emit damage text when damage is done', () => {
            const action = initAction();
            const { actor, target } = action;
            const attackValue = 2;
            const defenceValue = 1;
            const expectedText = -1 * (attackValue - defenceValue);

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            actor.throwAttack.mockReturnValueOnce(attackValue);
            target.throwDefence.mockReturnValueOnce(defenceValue);

            action.execute();

            expect(target.emitText).toHaveBeenCalled();
            // expect first argument (emitted text) to be expectedText
            expect(target.emitText.mock.calls[0][0]).toBe(expectedText);
        });

        it('should emit shield icon when no damage is done', () => {
            const action = initAction();
            const { actor, target } = action;
            const attackValue = 1;
            const defenceValue = 2;

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            actor.throwAttack.mockReturnValueOnce(attackValue);
            target.throwDefence.mockReturnValueOnce(defenceValue);

            action.execute();

            expect(target.emitIcon).toHaveBeenCalled();
            // expect first argument (icon name) to be 'shield'
            expect(target.emitIcon.mock.calls[0][0]).toBe('shield');
        });
    });
});
