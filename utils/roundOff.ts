
export const round = (num: number, decimals: number = 0) => {
    const d = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * d) / d;
}