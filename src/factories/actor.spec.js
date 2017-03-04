import createActor from './actor';
import createDice from '../factories/dice';

jest.mock('../factories/dice');

function createActorWithProps(props) {
    return Object.assign({}, createActor(), props);
}

describe('Actor', () => {
    describe('Throwing dices', () => {
        describe('Throwing attack', () => {
            it('should throw as many dices as the attack value is', () => {
                const actor = createActorWithProps({ attack: 2 });
                createDice.mockReturnValueOnce({ throw: () => 6 });
                // should have thrown 2 times
                expect(actor.throwAttack()).toBe(actor.attack);
            });

            it('should count the number of successess', () => {
                const actor = createActorWithProps({ attack: 2 });

                createDice.mockReturnValueOnce({
                    throw: jest.fn().mockReturnValueOnce(3).mockReturnValueOnce(5),
                });

                // number of successes should be one
                expect(actor.throwAttack()).toBe(1);
            });
        });

        describe('Throwing defence', () => {
            it('should throw as many dices as the defence value is', () => {
                const actor = createActorWithProps({ defence: 3 });
                createDice.mockReturnValueOnce({ throw: () => 6 });
                const actual = actor.throwDefence();
                // should have thrown 2 times
                expect(actual).toBe(actor.defence);
            });

            it('should count the number of successess', () => {
                const actor = createActorWithProps({ defence: 3 });
                createDice.mockReturnValueOnce({
                    throw: jest.fn()
                        .mockReturnValueOnce(3)
                        .mockReturnValueOnce(5)
                        .mockReturnValueOnce(3),
                });

                const actual = actor.throwDefence();

                // number of successes should be one
                expect(actual).toBe(1);
            });
        });

        describe('Throwing for movement', () => {
            it('should throw as many dices as the movement value is', () => {
                const actor = createActorWithProps({ movement: 2 });
                createDice.mockReturnValueOnce({ throw: () => 6 });
                const actual = actor.throwMovement();
                // should have thrown 2 times
                expect(actual).toBe(actor.movement * 6);
            });

            it('should count the sum of dices\' values', () => {
                const actor = createActorWithProps({ movement: 2 });

                const firstThrow = 5;
                const secondThrow = 3;

                createDice.mockReturnValueOnce({
                    throw: jest.fn()
                        .mockReturnValueOnce(firstThrow)
                        .mockReturnValueOnce(secondThrow),
                });
                const actual = actor.throwMovement();
                const expected = firstThrow + secondThrow;

                // should sum the throw results
                expect(actual).toBe(expected);
            });
        });
    });
});
