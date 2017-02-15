import Actor from './actor';
import Game from '../common/game';
import Dice from '../classes/dice';

const props = {
    attack: 2,
    defence: 3,
    movement: 2,
    health: 10,
};

jest.mock('phaser');
jest.mock('../classes/dice');
jest.mock('../common/game');

describe('Actor', () => {
    let actor;

    beforeEach(() => {
        actor = new Actor(new Game());
        Object.assign(actor, props);
        Dice.prototype.throw.mockClear();
    });

    describe('Throwing dices', () => {
        describe('Throwing attack', () => {
            it('should throw as many dices as the attack value is', () => {
                actor.throwAttack();
                // should have thrown 2 times
                expect(Dice.prototype.throw).toHaveBeenCalledTimes(props.attack);
            });

            it('should count the number of successess', () => {
                Dice.prototype.throw
                    // not success
                    .mockReturnValueOnce(3)
                    // success
                    .mockReturnValueOnce(5);

                // number of successes should be one
                expect(actor.throwAttack()).toBe(1);
            });
        });

        describe('Throwing defence', () => {
            it('should throw as many dices as the defence value is', () => {
                actor.throwDefence();
                // should have thrown 3 times
                expect(Dice.prototype.throw).toHaveBeenCalledTimes(props.defence);
            });

            it('should count the number of successess', () => {
                Dice.prototype.throw
                    // not success
                    .mockReturnValueOnce(3)
                    // success
                    .mockReturnValueOnce(5);

                // number of successes should be one
                expect(actor.throwDefence()).toBe(1);
            });
        });

        describe('Throwing for movement', () => {
            it('should throw as many dices as the movement value is', () => {
                actor.throwMovement();
                // should have thrown 4 times
                expect(Dice.prototype.throw).toHaveBeenCalledTimes(props.movement);
            });

            it('should count the sum of dices\' values', () => {
                Dice.prototype.throw
                    // not success
                    .mockReturnValueOnce(3)
                    // success
                    .mockReturnValueOnce(5);

                // number of successes should be one
                expect(actor.throwMovement()).toBe(8);
            });
        });
    });
});
