import Purse from './purse';
import gameConfig from '../config/gameconfig.json';

let id = 0;

const fillPurse = (purse, amount, isEquipped) => {
    for (let i = 0; i < amount; i++) {
        purse.add({ id: ++id, isEquipped: isEquipped || false });
    }
};

describe('Purse', () => {
    let purse;

    beforeEach(() => {
        purse = new Purse();
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
            expect(purse.add({ id: 1 })).toBeTruthy();
        });

        it('should not add item to the purse if full', () => {
            fillPurse(purse, purse.size);

            expect(purse.length).toBe(purse.size);

            expect(purse.add({ id: purse.size + 1 })).not.toBeTruthy();
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
