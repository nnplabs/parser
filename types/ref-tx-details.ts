import { SupportedProtocols } from "./supported-protocols";

export enum RefSupportedEvents {
    Swap = "Swap",
    AddLiquidity = "Add Liquidity",
    RemoveLiquidity = "Remove Liquidity",
}

export interface RefSwapTxDetails {
    token_sold: string;
    token_bought: string;
    amount_sold: string;
    amount_bought: string;
    timestamp: string;
}

export interface RefAddLiquidityTxDetails {
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
    poolId: string;
    timestamp: string;
}

export interface RefRemoveLiquidityTxDetails {
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
    poolId: string;
    timestamp: string;
}

export declare type RefSwapTxData = {
    eventName: RefSupportedEvents.Swap
    data: RefSwapTxDetails
}

export declare type RefAddLiquidityTxData = {
    eventName: RefSupportedEvents.AddLiquidity
    data: RefAddLiquidityTxDetails
}

export declare type RefRemoveLiquidityTxData = {
    eventName: RefSupportedEvents.RemoveLiquidity
    data: RefRemoveLiquidityTxDetails
}

export declare type RefTxData = RefSwapTxData | RefAddLiquidityTxData | RefRemoveLiquidityTxData;

export declare type RefTxDetails = RefTxData & {
    appName: SupportedProtocols.RefFinance;
    userWalletAddress: string;
    txHash: string;
    apiKey: string;
}