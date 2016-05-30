import {reduce, sum} from 'lodash';
import SpriteBase from 'sprites/spritebase';
import Dice from 'classes/dice';

/**
 * @class Actor
 * @description
 * @extends {Sprite}
 */
export default class Actor extends SpriteBase {

    constructor(...props) {
        super(...props);
        this.center();
    }

    decideAction() {}

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
        //return (this.movementPoints = this._throwDicesForSum(this.movement));
        this.movementPoints = 7;
        return 7;
    }

    /**
     * Throw dices counting sum of values
     * @private
     * @param   {number} amount
     * @return  {number}
     */
    _throwDicesForSum(amount) {
        return sum(this._throwDices(amount));
    }

    /**
     * Throw dices counting only successes
     * @private
     * @param   {number} amount Amount of dices to throw
     * @return  {number} The amount of successes
     */
    _throwDicesForSuccesses(amount) {
        const results = this._throwDices(amount);

        return reduce(results, (memo, value) => {
            return memo + (value > 3 ? 1 : 0);
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