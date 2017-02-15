import LootAction from './lootaction';
import Actor from '../sprites/actor';
import Treasure from '../sprites/treasure';
import Purse from '../classes/purse';
import Events from '../events/events';
import EventDispatcher from '../events/eventdispatcher';

jest.mock('../sprites/actor');
jest.mock('../sprites/treasure');
jest.mock('../classes/purse');
jest.mock('../events/eventdispatcher');

describe('Action: LootAction', () => {
    function initAction() {
        const actor = new Actor();
        actor.purse = new Purse();
        const treasure = new Treasure();
        return new LootAction({ actor, treasure });
    }

    beforeEach(() => EventDispatcher.dispatch.mockClear());

    describe('Initialization', () => {
        it('should have priority of 1 by default', () => {
            const action = initAction();
            expect(action.priority).toBe(1);
        });
    });

    describe('Validation', () => {
        it('should require an actor', () => {
            expect(() => new LootAction({})).toThrow('actor is missing!');
        });

        it('should require actor to be an instance of actor', () => {
            const command = { actor: 1 };
            expect(() => new LootAction(command)).toThrow('actor is invalid!');
        });

        it('should require a treasure', () => {
            const command = { actor: new Actor() };
            expect(() => new LootAction(command)).toThrow('treasure is missing!');
        });

        it('should require treasure be an instanceof treasure', () => {
            const command = { actor: new Actor(), treasure: 1 };
            expect(() => new LootAction(command)).toThrow('treasure is invalid!');
        });

        it('should not throw if validations pass', () => {
            const command = { actor: new Actor(), treasure: new Treasure() };
            expect(() => new LootAction(command)).not.toThrow();
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

            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.LootEvent);
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
            const dmg = 3;

            treasure.trapDamage.mockReturnValueOnce(dmg);
            treasure.loot.mockReturnValueOnce({ gold: 0, items: [] });

            action.execute();

            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.DamageEvent);
        });

        it('should add loot gold to actor\'s purse', () => {
            const action = initAction();
            const loot = { gold: 100, items: [] };
            action.treasure.loot.mockReturnValueOnce(loot);

            action.execute();

            expect(action.actor.purse.addGold).toHaveBeenCalledWith(loot.gold);
        });

        it('should add loot items to actor\'s purse', () => {
            const action = initAction();
            const loot = { gold: 100, items: [{ itemGroup: 1 }] };
            action.treasure.loot.mockReturnValueOnce(loot);

            action.execute();

            expect(action.actor.purse.add).toHaveBeenCalledWith(loot.items);
        });

        it('should automatically equip items if actor does not have item of same group equipped', () => {
            const action = initAction();
            const loot = { gold: 100, items: [{ itemGroup: 1 }, { itemGroup: 2 }] };
            action.treasure.loot.mockReturnValueOnce(loot);

            action.actor.purse.hasItemOfGroupEquipped = jest.fn(g => g !== 1);

            action.execute();

            expect(action.actor.purse.equipItem).toHaveBeenCalledWith(loot.items[0]);
            expect(action.actor.purse.equipItem).not.toHaveBeenCalledWith(loot.items[1]);
        });

        it('should automatically equip all items if actor does not have item of same group equipped', () => {
            const action = initAction();
            const loot = { gold: 100, items: [{ itemGroup: 1 }, { itemGroup: 2 }] };
            action.treasure.loot.mockReturnValueOnce(loot);

            action.actor.purse.hasItemOfGroupEquipped.mockReturnValue(false);

            action.execute();

            expect(action.actor.purse.equipItem).toHaveBeenCalledWith(loot.items[0]);
            expect(action.actor.purse.equipItem).toHaveBeenCalledWith(loot.items[1]);
        });

        it('should destroy the treasure after looting', () => {
            const action = initAction();
            action.treasure.loot.mockReturnValueOnce({ gold: 0, items: [] });

            action.execute();

            expect(action.treasure.destroy).toHaveBeenCalled();
        });
    });
});
