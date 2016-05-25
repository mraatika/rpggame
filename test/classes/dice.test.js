import {expect} from 'chai';
import Dice from '../../src/classes/dice';

describe('Dice', () => {

    describe('Initializing', function () {
        it('should have six sides by default', function () {
            const dice = new Dice();
            expect(dice.sides).to.equal(6);
        });

        it('should take sides as an argument', function () {
            const dice = new Dice(8);
            expect(dice.sides).to.equal(8);
        });
    });

    describe('Throwing', function () {
        it('should return a value between 1 and sides', function () {
            const dice = new Dice();

            for (var i = 0; i < 1000; i++) {
                const result = dice.throw();
                expect(result).to.be.a('number');
                expect(result).to.be.within(1, dice.sides);
            }
        });
    });
});