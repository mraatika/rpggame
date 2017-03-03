import createDice from './dice';

describe('Dice', () => {
    describe('Initializing', () => {
        it('should have six sides by default', () => {
            const d6 = createDice();
            expect(d6.sides).toBe(6);
        });

        it('should take sides as an argument', () => {
            const d8 = createDice(8);
            expect(d8.sides).toBe(8);
        });
    });

    describe('Throwing', () => {
        it('should return a value between 1 and sides', () => {
            const d6 = createDice(6);

            for (let i = 0; i < 1000; i++) {
                const result = d6.throw();
                expect(typeof result).toBe('number');
                expect(result).toBeGreaterThanOrEqual(1);
                expect(result).toBeLessThanOrEqual(d6.sides);
            }
        });
    });
});
