import { round } from "./roundOff";
import { tokenMetaData } from "./tokenMetaData";

export const getTokenSymbol = (tokenAddress: string): string => {
    if (tokenAddress in tokenMetaData) {
        const tokenSymbol = tokenMetaData[tokenAddress].symbol;
        return tokenSymbol;
    }
    return tokenAddress;
}

export const getTokenDecimals = (tokenAddress: string): number => {
    if (tokenAddress in tokenMetaData) {
        const tokenDecimals = tokenMetaData[tokenAddress].decimals;
        return tokenDecimals;
    }
    return 24;
}

export const formatTokenAmountByAddress = (tokenAddress: string, amount: string): string => {
    const tokenDecimals = getTokenDecimals(tokenAddress);
    const tokenAmount = Number(amount) / Math.pow(10, tokenDecimals);
    if (tokenAmount < 0.001) {
        return "<0.001";
    }
    return round(tokenAmount, 3).toString();
}

export const formatTokenAmountBySymbol = (tokenSymbol: string, amount: string): string => {
    const tokenAddress = Object.keys(tokenMetaData).find(key => tokenMetaData[key].symbol === tokenSymbol);
    if (tokenAddress) {
        return formatTokenAmountByAddress(tokenAddress, amount);
    }
    return formatTokenAmountByAddress("wrap.near", amount);
}