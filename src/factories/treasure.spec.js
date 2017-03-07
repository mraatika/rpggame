import createTreasure from './treasure';
import createItem from './item';
import * as utils from '../utils/utils';
import gameConfig from '../config/gameconfig.json';

const config = gameConfig.treasure;

jest.mock('../utils/utils');
jest.mock('./item', () => jest.fn());

describe('Treasure', () => {
    beforeEach(() => {
        utils.randomBetween.mockReset();
        utils.randomByChance.mockReset();
    });

    describe('Initializing', () => {
        it('should set default trapChance from config', () => {
            expect(createTreasure().trapChance).toBe(config.trapChance);
        });

        it('should override trapChance with props', () => {
            expect(createTreasure({ trapChance: 1 }).trapChance).toBe(1);
        });
    });

    describe('TrapDamage', () => {
        it('should return damage when trap goes off', () => {
            const expected = 100;
            const treasure = createTreasure({ damage: expected });
            utils.randomByChance.mockReturnValueOnce(true);
            expect(treasure.trapDamage()).toBe(expected);
        });

        it('should not return damage when trap does not come off', () => {
            const treasure = createTreasure();
            utils.randomByChance.mockReturnValueOnce(false);
            expect(treasure.trapDamage()).toBe(0);
        });
    });

    describe('Loot', () => {
        it('should return items when dice rolls succeed', () => {
            const expected = [{ id: 1 }, { id: 2 }];

            utils.randomByChance.mockReturnValue(true);
            createItem
                .mockReturnValueOnce(expected[0])
                .mockReturnValueOnce(expected[1]);

            const treasure = createTreasure({ items: expected });
            expect(treasure.loot().items).toEqual(expected);
        });

        it('should no items when dice rolls fail', () => {
            utils.randomByChance.mockReturnValue(false);
            const expected = [];
            const treasure = createTreasure({ items: expected });
            expect(treasure.loot().items).toEqual(expected);
        });

        it('should return only items that are successfully rolled', () => {
            const items = [{ id: 1 }, { id: 2 }];
            const expected = [items[1]];

            utils.randomByChance
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);

            createItem
                .mockReturnValueOnce(items[1]);

            const treasure = createTreasure({ items });
            expect(treasure.loot().items).toEqual(expected);
        });

        it('should return all items if shouldThrowForLoot is false', () => {
            const items = [{ id: 1 }, { id: 2 }];

            utils.randomByChance.mockReturnValue(false);

            const treasure = createTreasure({ items, shouldThrowForItems: false });
            expect(treasure.loot().items.length).toEqual(items.length);
        });

        it('should loot random amount of gold ', () => {
            const expected = 100;
            utils.randomBetween.mockReturnValueOnce(expected);
            const treasure = createTreasure();
            expect(treasure.loot().gold).toBe(expected);
        });

        it('should randomize a number between mingold and maxgold', () => {
            const minGold = 10;
            const maxGold = 100;
            const treasure = createTreasure({ minGold, maxGold });
            treasure.loot();
            expect(utils.randomBetween).toHaveBeenCalledWith(minGold, maxGold);
        });
    });
});
