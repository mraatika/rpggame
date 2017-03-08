/**
 * Randomize a number between -value and value.
 * @export
 * @param {number} max
 * @returns {number}
 */
export function betweenMaxMinusAndPlus(max) {
    const num = Math.floor((Math.random() * max) + 1) * Math.floor(Math.random() * 2);
    return num === 1 ? 1 : -1;
}

/**
 * Check if 'dice roll' is successfull
 * @export
 * @param {number} chance Chance of success
 * @returns {boolean}
 */
export function randomByChance(chance) {
    return Math.random() < chance;
}

/**
 * Randomize a number between given min and max
 * @export
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
}

/**
 * Return values in first array without items in second array
 * @export
 * @param {Array} list
 * @param {any} item
 * @returns {Array}
 */
export function without(list, item) {
    const itemArr = [].concat(item);
    return list.filter(i => itemArr.indexOf(i) < 0);
}

