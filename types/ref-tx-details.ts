import { SupportedProtocols } from "./supported-protocols";

export enum RefSupportedTxTypes {
    Swap = "swap",
    AddLiquidity = "add-liquidity",
    RemoveLiquidity = "remove-liquidity",
}

export type RefSupportedTxAction = RefSwapTx | RefAddLiquidityTx | RefRemoveLiquidityTx;

export declare type RefSwapTx = Record<RefSupportedTxTypes.Swap, RefSwapTxDetails>
export declare type RefAddLiquidityTx = Record<RefSupportedTxTypes.AddLiquidity, RefAddLiquidityTxDetails>
export declare type RefRemoveLiquidityTx = Record<RefSupportedTxTypes.RemoveLiquidity, RefRemoveLiquidityTxDetails>


export interface RefSwapTxDetails {
    token_sold: string;
    token_bought: string;
    amount_sold: string;
    amount_bought: string;
}

export interface RefAddLiquidityTxDetails {
    tokenList: string[];
    amountList: string[];
    poolId: string;
}

export interface RefRemoveLiquidityTxDetails {
    tokenList: string[];
    amountList: string[];
    poolId: string;
}

export interface RefTxDetails {
    appId: SupportedProtocols.RefFinance;
    action: RefSupportedTxAction;
    signerId: string;
    hash: string;
    timestamp: Date;
}