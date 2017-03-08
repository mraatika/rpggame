import lootAction from './lootaction';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import * as validations from '../utils/validations';
import * as vuerenderer from '../vue/vuerenderer';

jest.mock('../events/eventdispatcher');
jest.mock('../vue/vuerenderer');
jest.mock('../vue/lootdialog');

describe('Action: LootAction', () => {
    function initAction() {
        const actor = {
            damage: jest.fn(),
            emitText: jest.fn(),
        };

        actor.purse = {
            addGold: jest.fn(),
            add: jest.fn(),
            getEquippedItemOfGroup: jest.fn(),
            equipItem: jest.fn(),
        };

        const treasure = {
            trapDamage: jest.fn(),
            loot: jest.fn(),
            destroy: jest.fn(),
        };

        return lootAction({ actor, treasure });
    }

    beforeEach(() => {
        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeTreasure = jest.fn();
        sendEvent.mockClear();
    });

    describe('Initialization', () => {
        it('should have priority of 1 by default', () => {
            const action = initAction();
            expect(action.priority).toBe(1);
        });
    });

    describe('Validation', () => {
        it('should not throw if validations pass', () => {
            const command = { actor: { purse: {} }, treasure: {} };
            expect(() => lootAction(command)).not.toThrow();
        });

        it('should validate actor', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is missing');
            expect(() => lootAction({})).toThrow('actor is missing!');
        });

        it('should require actor to have a purse property', () => {
            expect(() => lootAction({ actor: {} })).toThrow('actor is invalid!');
        });

        it('should validate treasure', () => {
            validations.shouldBeTreasure.mockReturnValueOnce('is missing');
            expect(() => lootAction({})).toThrow('treasure is missing!');
        });
    });

    describe('Execution', () => {
        it('should return true if execution is succesfull', () => {
            const action = initAction();
            action.treasure.loot.mockReturnValueOnce({ gold: 0, items: [] });
            expect(action.execute()).toBeTruthy();
        });

        it('should dispatch an loot event', () => {
            const action = initAction();
            const loot = { gold: 0, items: [] };
            action.treasure.loot.mockReturnValueOnce(loot);

            action.execute();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.LOOT_EVENT);
            expect(props.actor).toBe(action.actor);
            expect(props.treasure).toBe(action.treasure);
            expect(props.loot).toEqual(loot);
        });

        it('should do damage to the actor if the trap goes off', () => {
            const action = initAction();
            const { actor, treasure } = action;
            const dmg = 3;

            treasure.trapDamage.mockReturnValueOnce(dmg);
            treasure.loot.mockReturnValueOnce({ gold: 0, items: [] });

            action.execute();

            expect(actor.damage).toHaveBeenCalledWith(dmg);
            expect(actor.emitText).toHaveBeenCalledWith(-dmg);
        });

        it('should dispatch a damage event when trap goes off', () => {
            const action = initAction();
            const { treasure } = action;
            const damage = 3;

            treasure.trapDamage.mockReturnValueOnce(damage);
            treasure.loot.mockReturnValueOnce({ gold: 0, items: [] });

            action.execute();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.DAMAGE_EVENT);
            expect(props.actor).toBe(action.actor);
            expect(props.damage).toBe(damage);
        });

        it('should add loot gold to actor\'s purse', () => {
            const action = initAction();
            const loot = { gold: 100, items: [] };
            action.treasure.loot.mockReturnValueOnce(loot);

            action.execute();

            expect(action.actor.purse.addGold).toHaveBeenCalledWith(loot.gold);
        });

        it('should open loot dialog when there are items to loot', () => {
            const action = initAction();
            const loot = { gold: 100, items: [{ itemGroup: 1 }] };
            action.treasure.loot.mockReturnValueOnce(loot);

            vuerenderer.default = jest.fn().mockReturnValue({ show: jest.fn() });

            action.execute();

            expect(vuerenderer.default).toHaveBeenCalled();

            const propsArg = vuerenderer.default.mock.calls[0][1];

            expect(propsArg.initialItems).toBe(loot.items);
            expect(propsArg.character).toBe(action.actor);
            expect(propsArg.onClose).toBeInstanceOf(Function);
        });

        it('should set action pending when loot dialog is opened', () => {
            const action = initAction();
            action.treasure.loot.mockReturnValueOnce({ gold: 0, items: [{ id: 1 }] });

            vuerenderer.default = jest.fn().mockReturnValue({ show: jest.fn() });

            action.execute();

            expect(action.pending).toBe(true);
        });

        it('should destroy the treasure after looting', () => {
            const action = initAction();
            action.treasure.loot.mockReturnValueOnce({ gold: 0, items: [{ id: 1 }] });

            vuerenderer.default = jest.fn((o, props) => {
                props.onClose([]);
                return { show: jest.fn() };
            });

            action.execute();

            expect(action.treasure.destroy).toHaveBeenCalled();
        });

        it('should set action pending to false after looting', () => {
            const action = initAction();
            action.treasure.loot.mockReturnValueOnce({ gold: 0, items: [{ id: 1 }] });

            vuerenderer.default = jest.fn((o, props) => {
                props.onClose();
                return { show: jest.fn() };
            });

            action.execute();

            expect(action.pending).toBe(false);
        });

        it('should send an event after looting with looted gold and items', () => {
            const action = initAction();
            const loot = { gold: 0, items: [{ id: 1 }, { id: 2 }] };
            action.treasure.loot.mockReturnValueOnce(loot);

            vuerenderer.default = jest.fn((o, props) => {
                props.onClose(loot.items.slice(1));
                return { show: jest.fn() };
            });

            action.execute();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.LOOT_EVENT);
            expect(props.actor).toBe(action.actor);
            expect(props.treasure).toBe(action.treasure);
            expect(props.loot.gold).toBe(loot.gold);
            expect(props.loot.items).toEqual(loot.items.slice(1));
        });
    });
});
