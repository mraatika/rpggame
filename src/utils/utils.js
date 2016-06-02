
export const NumberUtils = {
    betweenMaxMinusAndPlus(max) {
        var num = Math.floor(Math.random() * max + 1);
        return num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    },

    randomByChance(chance) {
        return Math.random() < chance;
    }
};