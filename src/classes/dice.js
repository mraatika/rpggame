
/**
 * @class Dice
 * @description A dice
 */
export default class Dice {

    /**
     * @constructor
     * @param       {number} [sides = 6] The amount of dice's sides
     * @return      {Dice}
     */
    constructor(sides = 6) {
        this.sides = sides;
    }

    /**
     * Return a random number between 1 and the value of dice's sides
     * @return {number}
     */
    throw() {
        return Math.floor(Math.random() * this.sides) + 1;
    }

}