import createSack from './sack';

jest.mock('phaser');

describe('Sack', () => {
    const game = { make: { sprite: jest.fn(() => ({ anchor: { set: jest.fn() } })) } };

    it('should return 0 trap damage', () => {
        expect(createSack(game).trapDamage()).toBe(0);
    });

    it('should throw 0 gold by default', () => {
        const sack = createSack(game, 0, 0);
        expect(sack.loot().gold).toBe(0);
    });

    it('should not throw for items by default', () => {
        const items = [{}, {}];
        const sack = createSack(game, 0, 0, { items });
        expect(sack.loot().items.length).toEqual(items.length);
    });
});
