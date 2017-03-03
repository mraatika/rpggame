/**
 * A dice factory function
 * @name Dice
 * @param {number} [sides = 6] The amount of dice's sides
 * @return {Dice}
 */
export default function dice(sides = 6) {
    return Object.create({
        sides,
        /**
         * Return a random number between 1 and the value of dice's sides
         * @return {number}
         */
        throw() {
            return Math.floor(Math.random() * sides) + 1;
        },
    });
}
