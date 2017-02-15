
/**
 * The current number in the sequence
 * @type {number}
 */
let CURRENT_ID = 0;

/**
 * @class Sequence
 * @description A sequence of numbers
 */
export default class Sequence {

    /**
     * Return the number from the sequence
     * @static
     * @return {number} The next number from the sequence
     */
    static next() {
        return ++CURRENT_ID;
    }
}
