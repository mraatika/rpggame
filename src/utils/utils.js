
export const NumberUtils = {
    betweenMaxMinusAndPlus(max) {
        var num = Math.floor(Math.random() * max);
        return num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    }
};