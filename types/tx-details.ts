import { SupportedProtocols } from "./supported-protocols";

export enum SupportedTxTypes {
    Swap = "swap",
    AddLiquidity = "add-liquidity",
    RemoveLiquidity = "remove-liquidity",
}

export type SupportedTxAction = SwapTx | AddLiquidityTx | RemoveLiquidityTx;

export declare type SwapTx = Record<SupportedTxTypes.Swap, SwapTxDetails>
export declare type AddLiquidityTx = Record<SupportedTxTypes.AddLiquidity, AddLiquidityTxDetails>
export declare type RemoveLiquidityTx = Record<SupportedTxTypes.RemoveLiquidity, RemoveLiquidityTxDetails>


export interface SwapTxDetails {
    token_sold: string;
    token_bought: string;
    amount_sold: string;
    amount_bought: string;
}

export interface AddLiquidityTxDetails {
}

export interface RemoveLiquidityTxDetails {
}

export declare type TxDetails = {
    appId: SupportedProtocols
    action: SupportedTxAction
    signerId: string
    hash: string
    timestamp: Date
}
