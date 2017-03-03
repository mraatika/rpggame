import createDice from '../factories/dice';

/**
 * Throw given amount of dices
 * @private
 * @param   {number} count The amount of dices to throw
 * @return  {number} The number of successes
 */
function throwDices(count) {
    const dice = createDice(6);
    const results = [];

    for (let i = 0; i < count; i++) {
        results.push(dice.throw());
    }

    return results;
}

/**
 * Throw dices counting sum of values
 * @private
 * @param   {number} amount
 * @return  {number}
 */
function throwDicesForSum(amount) {
    return throwDices(amount).reduce((sum, result) => sum + result, 0);
}
 /**
 * Throw dices counting only successes
 * @private
 * @param   {number} amount Amount of dices to throw
 * @return  {number} The amount of successes
 */
function throwDicesForSuccesses(amount) {
    const results = throwDices(amount);
    return results.reduce((memo, value) => memo + (value > 3 ? 1 : 0), 0);
}

/**
 * @exports
 * @name Actor
 * Factory function to create an actor that can be used
 * to compose speciliazed actors. An actor can decide actions
 * throw dices to do certain actions.
 * @returns {Actor}
 */
export default function Actor(props = {}) {
    return Object.assign(
        {},
        props,
        {
            decideAction() {},

            /**
             * Throw dices for attack
             * @memberOf Actor
             * @return {number} The number of successes
             */
            throwAttack() {
                return throwDicesForSuccesses(this.attack);
            },

            /**
             * Throw dices for defence
             * @memberOf Actor
             * @return {number} The number of successes
             */
            throwDefence() {
                return throwDicesForSuccesses(this.defence);
            },

            /**
            * Throw dices for movement
             * @memberOf Actor
            * @return {number} The number of successes
            */
            throwMovement() {
                return (this.movementPoints = throwDicesForSum(this.movement));
            },
        },
    );
}
