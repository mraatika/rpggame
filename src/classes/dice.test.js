import Dice from './dice';

describe('Dice', () => {
    describe('Initializing', () => {
        it('should have six sides by default', () => {
            const dice = new Dice();
            expect(dice.sides).toBe(6);
        });

        it('should take sides as an argument', () => {
            const dice = new Dice(8);
            expect(dice.sides).toBe(8);
        });
    });

    describe('Throwing', () => {
        it('should return a value between 1 and sides', () => {
            const dice = new Dice();

            for (let i = 0; i < 1000; i++) {
                const result = dice.throw();
                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThanOrEqual(1);
                expect(result).toBeLessThanOrEqual(dice.sides);
            }
        });
    });
});
