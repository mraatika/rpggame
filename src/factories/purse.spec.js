import createPurse from './purse';
import gameConfig from '../config/gameconfig.json';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';

jest.mock('../events/eventdispatcher');

const fillPurse = (purse, amount, isEquipped = false) => {
    for (let i = 0; i < amount; i++) {
        purse.add({ id: i, isEquipped });
    }
};

describe('Purse', () => {
    beforeEach(() => {
        sendEvent.mockClear();
    });

    describe('Initializing', () => {
        it('should have the size of 10 by default', () => {
            const purse = createPurse();
            expect(purse.size).toBe(gameConfig.player.purse.size);
        });

        it('should override default size with given size', () => {
            const purse = createPurse(5);
            expect(purse.size).toBe(5);
        });

        it('should have zero items by default', () => {
            const purse = createPurse();
            expect(purse.getItems().length).toBe(0);
        });
    });

    describe('Adding items to purse', () => {
        it('should add item to the purse', () => {
            const purse = createPurse();
            const item = { id: 1 };
            purse.add(item);
            expect(purse.getItems()[0]).toBe(item);
        });

        it('should not add item to the purse if full', () => {
            const purse = createPurse();
            fillPurse(purse, purse.size);

            expect(purse.getItems().length).toBe(purse.size);

            expect(purse.add({ id: purse.size + 1 })).not.toBeTruthy();
        });

        it('should add all items that fit and leave out those that don\'t', () => {
            const purse = createPurse();
            fillPurse(purse, purse.size - 2);

            const items = [{ id: 96 }, { id: 97 }, { id: 98 }, { id: 99 }];

            purse.add(items);

            expect(purse.getItems().indexOf(items[0])).not.toBe(-1);
            expect(purse.getItems().indexOf(items[1])).not.toBe(-1);

            expect(purse.getItems().indexOf(items[2])).toBe(-1);
            expect(purse.getItems().indexOf(items[3])).toBe(-1);
        });

        it('should drop item\'s that doesn\'t fit in the purse', () => {
            const purse = createPurse();
            fillPurse(purse, purse.size - 2);

            const items = [{ id: 96 }, { id: 97 }, { id: 98 }, { id: 99 }];

            purse.add(items);

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.ITEM_DROPPED_EVENT);
            expect(props.item).toEqual(items.slice(2));
        });

        it('should not drop anything if all items fit', () => {
            const purse = createPurse();
            const items = [{ id: 96 }, { id: 97 }, { id: 98 }, { id: 99 }];
            purse.size = items.length;

            purse.add(items);

            expect(sendEvent).not.toHaveBeenCalled();
        });
    });

    describe('Getting items from the purse', () => {
        it('should return item with given id', () => {
            const purse = createPurse();
            fillPurse(purse, 2);
            expect(purse.getItem(0)).toBeTruthy();
            expect(purse.getItem(1)).toBeTruthy();
        });

        it('should return nothing when an item with given id is not found', () => {
            const purse = createPurse();
            expect(purse.getItem(2)).not.toBeTruthy();
        });
    });

    describe('Removing items from purse', () => {
        it('should remove item from purse with item id as an argument', () => {
            const purse = createPurse();
            fillPurse(purse, 3);
            purse.remove(2);

            expect(purse.getItems().length).toBe(2);
            expect(purse.getItem(2)).not.toBeTruthy();
        });

        it('should do nothing if item with given id is not found', () => {
            const purse = createPurse();
            fillPurse(purse, 1);
            purse.remove(2);
            expect(purse.getItems().length).toBe(1);
        });

        it('should remove item from purse with item as an argument', () => {
            const purse = createPurse();
            fillPurse(purse, 1);
            const item = purse.getItem(0);
            purse.remove(item);
            expect(purse.getItems().length).toBe(0);
        });
    });

    describe('Getting all equipped items from the purse', () => {
        it('should return all the equipped items', () => {
            const purse = createPurse();
            fillPurse(purse, 3, true);
            fillPurse(purse, 3, false);
            expect(purse.getEquippedItems().length).toBe(3);
        });
    });
});
