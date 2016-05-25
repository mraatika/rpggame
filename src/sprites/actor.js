import {reduce, sum} from 'lodash';
import SpriteBase from 'sprites/spritebase';
import Dice from 'classes/dice';

/**
 * @class Actor
 * @description
 * @extends {Sprite}
 */
export default class Actor extends SpriteBase {

    /**
     * Return a movement strategy object
     * @abstract
     */
    getMovementStrategy() {
        throw new Error('Called an abstract method getMovementStrategy!');
    }

    /**
     * Decrease health with given amount
     * @param  {number} amount
     * @return {Actor}
     */
    damage(amount) {
        this.health -= +amount;
        return this.health;
    }

    /**
     * Throw dices for attack
     * @return {number} The number of successes
     */
    throwAttack() {
        return this._throwDicesForSuccesses(this.attack);
    }

    /**
     * Throw dices for defence
     * @return {number} The number of successes
     */
    throwDefence() {
        return this._throwDicesForSuccesses(this.defence);
    }

    /**
     * Throw dices for movement
     * @return {number} The number of successes
     */
    throwMovement() {
        return this._throwDicesForSum(this.movement);
    }

    _throwDicesForSum(count) {
        return sum(this._throwDices(count));
    }

    /**
     * Throw dices counting only successes
     * @param   {[type]} count [description]
     * @return  {[type]}
     * @private
     */
    _throwDicesForSuccesses(count) {
        const results = this._throwDices(count);

        return reduce(results, (memo, value) => {
            return memo + (value > 4 ? 1 : 0);
        }, 0);
    }

    /**
     * Throw given amount of dices
     * @private
     * @param   {number} count The amount of dices to throw
     * @return  {number} The number of successes
     */
    _throwDices(count) {
        const dice = new Dice(6);
        let results = [];

        for (let i = 0; i < count; i++) {
            results.push(dice.throw());
        }

        return results;
    }
}