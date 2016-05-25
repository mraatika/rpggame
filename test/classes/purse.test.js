import {expect} from 'chai';
import Purse from '../../src/classes/purse';
import gameConfig from 'json!../../src/assets/config/gameconfig.json';

let id = 0;

const fillPurse = (purse, amount, isEquipped) => {

    for (var i = 0; i < amount; i++) {
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
            expect(purse.size).to.equal(gameConfig.player.purse.size);
        });

        it('should have length of zero by default', function () {
            expect(purse.length).to.equal(0);
        });
    });

    describe('Adding items to purse', function () {
        it('should add item to the purse', function () {
            expect(purse.add({ id: 1 })).to.be.ok;
        });

        it('should not add item to the purse if full', function () {

            fillPurse(purse, purse.size);

            expect(purse.length).to.equal(purse.size);

            expect(purse.add({ id: purse.size + 1 })).not.to.be.ok;
        });
    });

    describe('Getting items from the purse', function () {
        it('should return item with given id', function () {
            fillPurse(purse, 2);
            expect(purse.getItem(1)).to.be.ok;
            expect(purse.getItem(2)).to.be.ok;
        });

        it('should return nothing when an item with given id is not found', function () {
            expect(purse.getItem(2)).not.to.be.ok;
        });
    });

    describe('Removing items from purse', function () {
        it('should remove item from purse with item id as an argument', function () {
            fillPurse(purse, 3);
            purse.remove(2);

            expect(purse.length).to.equal(2);
            expect(purse.getItem(2)).not.to.be.ok;
        });

        it('should do nothing if item with given id is not found', function () {
            fillPurse(purse, 1);
            purse.remove(2);
            expect(purse.length).to.equal(1);
        });

        it('should remove item from purse with item as an argument', function () {
            fillPurse(purse, 1);
            const item = purse.getItem(1);
            purse.remove(item);
            expect(purse.length).to.equal(0);
        });
    });

    describe('Getting all equipped items from the purse', function () {
        it('should return all the equipped items', function () {
            fillPurse(purse, 3, true);
            fillPurse(purse, 3, false);
            expect(purse.getEquippedItems().length).to.equal(3);
        });
    });
});