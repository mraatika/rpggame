
export function betweenMaxMinusAndPlus(max) {
    const num = Math.floor((Math.random() * max) + 1) * Math.floor(Math.random() * 2);
    return num === 1 ? 1 : -1;
}

export function randomByChance(chance) {
    return Math.random() < chance;
}

/**
 * Template string helper. Replace ${key} substrings with corresponding values from vars object
 * @exports
 * @param  {string} str The template string
 * @param  {Object} vars Values to interpolate template with.
 * @returns {string}
 */
export function tpl(str, vars = {}) {
    return Object.keys(vars).reduce((memo, key) => memo.replace(new RegExp(`\\$\{${key}}`, 'g'), vars[key]), str);
}
