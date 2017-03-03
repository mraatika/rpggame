import createTreasure from './treasure';
import * as utils from '../utils/utils';

jest.mock('../utils/utils');
jest.mock('../config/gameconfig.json', () => ({}));

describe('Treasure', () => {
    describe('Initializing', () => {
        describe('defaults', () => {
            test('items', () => {
                expect(createTreasure().items).toEqual([]);
            });

            test('minGold', () => {
                expect(createTreasure().minGold).toBe(0);
            });

            test('maxGold', () => {
                expect(createTreasure().maxGold).toBe(0);
            });

            test('trapChance', () => {
                expect(createTreasure().trapChance).toBe(0);
            });

            test('damage', () => {
                expect(createTreasure().damage).toBe(0);
            });
        });

        describe('overriding defaults with props', () => {
            test('items', () => {
                const items = [{ id: 1 }];
                expect(createTreasure({ items }).items).toBe(items);
            });

            test('minGold', () => {
                expect(createTreasure({ minGold: 100 }).minGold).toBe(100);
            });

            test('maxGold', () => {
                expect(createTreasure({ maxGold: 100 }).maxGold).toBe(100);
            });

            test('trapChance', () => {
                expect(createTreasure({ trapChance: 1 }).trapChance).toBe(1);
            });

            test('damage', () => {
                expect(createTreasure({ damage: 100 }).damage).toBe(100);
            });
        });
    });

    describe('TrapDamage', () => {
        it('should return damage when trap goes off', () => {
            const treasure = createTreasure();
            utils.randomByChance.mockReturnValueOnce(true);
            expect(treasure.trapDamage()).toBe(treasure.damage);
        });

        it('should not return damage when trap does not come off', () => {
            const treasure = createTreasure();
            utils.randomByChance.mockReturnValueOnce(false);
            expect(treasure.trapDamage()).toBe(0);
        });
    });

    describe('Loot', () => {
        it('should return items when dice roll succeeds', () => {

            utils.randomByChance.mockReturnValueOnce(true);
        });
    });
});
