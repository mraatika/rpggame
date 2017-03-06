import attackAction from './attackaction';
import * as MapUtils from '../utils/maputils';
import EventTypes from '../constants/eventtypes';
import { sendEvent } from '../events/eventdispatcher';
import * as validations from '../utils/validations';

jest.mock('../utils/maputils');
jest.mock('../events/eventdispatcher');

describe('Action: AttackAction', () => {
    function initAction() {
        const actor = {
            throwAttack: jest.fn(),
        };
        const target = {
            throwDefence: jest.fn(),
            emitIcon: jest.fn(),
            emitText: jest.fn(),
            damage: jest.fn(),
        };

        return attackAction({ actor, target });
    }

    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        sendEvent.mockClear();
    });

    describe('Validation', () => {
        it('should not throw if validations pass', () => {
            expect(() => attackAction({})).not.toThrow();
        });

        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => attackAction({})).toThrow('actor is missing!');
        });

        it('should validate target', () => {
            validations.shouldBeActorSprite
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce('is missing');
            expect(() => attackAction({})).toThrow('target is missing!');
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

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.ATTACK_EVENT);
            expect(props.actor).toBe(action.actor);
            expect(props.target).toBe(action.target);
            expect(props.attack).toBe(attackValue);
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

        it('should emit miss text when attack is zero', () => {
            const action = initAction();
            const { actor, target } = action;
            const attackValue = 0;
            const expectedText = 'miss';

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);
            actor.throwAttack.mockReturnValueOnce(attackValue);

            action.execute();

            const emitTextCallArgs = target.emitText.mock.calls[0];

            expect(target.emitText).toHaveBeenCalled();
            // expect first argument (emitted text) to be expectedText
            expect(emitTextCallArgs[0]).toBe(expectedText);
            // should be pending until animation is done
            expect(action.pending).toBe(true);
            // should not be finished until animation is done
            expect(action.isDone).toBe(false);

            // call callback function
            emitTextCallArgs[1].call(action);

            expect(action.pending).toBe(false);
            expect(action.isDone).toBe(true);
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

            const type = sendEvent.mock.calls[1][0];
            const props = sendEvent.mock.calls[1][1];

            expect(type).toBe(EventTypes.DEFEND_EVENT);
            expect(props.actor).toBe(action.target);
            expect(props.defence).toBe(defenceValue);
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
            expect(target.damage).toHaveBeenCalledWith(damage);

            const type = sendEvent.mock.calls[2][0];
            const props = sendEvent.mock.calls[2][1];

            expect(result).toBeTruthy();
            expect(type).toBe(EventTypes.DAMAGE_EVENT);
            expect(props.actor).toBe(action.target);
            expect(props.damage).toBe(damage);
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

            const emitTextCallArgs = target.emitText.mock.calls[0];

            expect(target.emitText).toHaveBeenCalled();
            // expect first argument (emitted text) to be expectedText
            expect(emitTextCallArgs[0]).toBe(expectedText);
            // should be pending until animation is done
            expect(action.pending).toBe(true);
            // should not be finished until animation is done
            expect(action.isDone).toBe(false);

            // call callback function
            emitTextCallArgs[1].call(action);

            expect(action.pending).toBe(false);
            expect(action.isDone).toBe(true);
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

            const emitIconCallArgs = target.emitIcon.mock.calls[0];

            expect(target.emitIcon).toHaveBeenCalled();
            // expect first argument (icon name) to be 'shield'
            expect(emitIconCallArgs[0]).toBe('shield');
            // should be pending until animation is done
            expect(action.pending).toBe(true);
            // should not be finished until animation is done
            expect(action.isDone).toBe(false);

            // call callback function
            emitIconCallArgs[1].call(action);

            expect(action.pending).toBe(false);
            expect(action.isDone).toBe(true);
        });
    });
});
