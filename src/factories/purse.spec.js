import createPurse from './purse';
import gameConfig from '../config/gameconfig.json';
import EventDispatcher from '../events/eventdispatcher';
import ItemDroppedEvent from '../events/itemdroppedevent';

jest.mock('../events/eventdispatcher');

let id = 0;

const fillPurse = (purse, amount, isEquipped = false) => {
    for (let i = 0; i < amount; i++) {
        purse.add({ id: ++id, isEquipped });
    }
};

describe('Purse', () => {
    let purse;

    beforeEach(() => {
        purse = createPurse();
        EventDispatcher.dispatch.mockClear();
    });

    afterEach(() => {
        id = 0;
    });

    describe('Initializing', () => {
        it('should have the size of 10 by default', () => {
            expect(purse.size).toBe(gameConfig.player.purse.size);
        });

        it('should have length of zero by default', () => {
            expect(purse.length).toBe(0);
        });
    });

    describe('Adding items to purse', () => {
        it('should add item to the purse', () => {
            const item = { id: 1 };
            purse.add(item);
            expect(purse.items[0]).toBe(item);
        });

        it('should not add item to the purse if full', () => {
            fillPurse(purse, purse.size);

            expect(purse.length).toBe(purse.size);

            expect(purse.add({ id: purse.size + 1 })).not.toBeTruthy();
        });

        it('should add all items that fit and leave out those that don\'t', () => {
            fillPurse(purse, purse.size - 2);

            const items = [{ id: 96 }, { id: 97 }, { id: 98 }, { id: 99 }];

            purse.add(items);

            expect(purse.items.indexOf(items[0])).not.toBe(-1);
            expect(purse.items.indexOf(items[1])).not.toBe(-1);

            expect(purse.items.indexOf(items[2])).toBe(-1);
            expect(purse.items.indexOf(items[3])).toBe(-1);
        });

        it('should drop item\'s that doesn\'t fit in the purse', () => {
            fillPurse(purse, purse.size - 2);

            const items = [{ id: 96 }, { id: 97 }, { id: 98 }, { id: 99 }];

            purse.add(items);

            const arg = EventDispatcher.dispatch.mock.calls[1][0];

            expect(arg).toBeInstanceOf(ItemDroppedEvent);
            expect(arg.item).toEqual(items.slice(2));
        });

        it('should not drop anything if all items fit', () => {
            const items = [{ id: 96 }, { id: 97 }, { id: 98 }, { id: 99 }];
            purse.size = items.length;

            purse.add(items);

            expect(EventDispatcher.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('Getting items from the purse', () => {
        it('should return item with given id', () => {
            fillPurse(purse, 2);
            expect(purse.getItem(1)).toBeTruthy();
            expect(purse.getItem(2)).toBeTruthy();
        });

        it('should return nothing when an item with given id is not found', () => {
            expect(purse.getItem(2)).not.toBeTruthy();
        });
    });

    describe('Removing items from purse', () => {
        it('should remove item from purse with item id as an argument', () => {
            fillPurse(purse, 3);
            purse.remove(2);

            expect(purse.length).toBe(2);
            expect(purse.getItem(2)).not.toBeTruthy();
        });

        it('should do nothing if item with given id is not found', () => {
            fillPurse(purse, 1);
            purse.remove(2);
            expect(purse.length).toBe(1);
        });

        it('should remove item from purse with item as an argument', () => {
            fillPurse(purse, 1);
            const item = purse.getItem(1);
            purse.remove(item);
            expect(purse.length).toBe(0);
        });
    });

    describe('Getting all equipped items from the purse', () => {
        it('should return all the equipped items', () => {
            fillPurse(purse, 3, true);
            fillPurse(purse, 3, false);
            expect(purse.getEquippedItems().length).toBe(3);
        });
    });
});
