import Treasure from './treasure';
import SpriteBase from './spritebase';
import * as utils from '../utils/utils';

jest.mock('./spritebase');
jest.mock('../utils/utils');

describe('Treasure', () => {
    let treasure;

    beforeEach(() => {
        treasure = new Treasure({}, 0, 0);
    });

    describe('Initializing', () => {
        it('should be an instance of SpriteBase', () => {
            expect(treasure).toBeInstanceOf(SpriteBase);
        });
    });

    describe('TrapDamage', () => {
        it('should return damage when trap goes off', () => {
            utils.randomByChance.mockReturnValueOnce(true);
            expect(treasure.trapDamage()).toBe(1);
        });

        it('should not return damage when trap does not come off', () => {
            utils.randomByChance.mockReturnValueOnce(false);
            expect(treasure.trapDamage()).toBe(0);
        });
    });
});
