
export function betweenMaxMinusAndPlus(max) {
    const num = Math.floor((Math.random() * max) + 1) * Math.floor(Math.random() * 2);
    return num === 1 ? 1 : -1;
}

export function randomByChance(chance) {
    return Math.random() < chance;
}

