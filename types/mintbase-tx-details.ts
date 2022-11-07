import { SupportedProtocols } from "./supported-protocols";

export enum MintbaseSupportedTxTypes {
    Mint = "mint",
    Transfer = "transfer"
}

export type MintbaseSupportedTxAction = MintbaseMintTx | MintbaseTransferTx;

export declare type MintbaseMintTx = Record<MintbaseSupportedTxTypes.Mint, MintbaseMintTxDetails>
export declare type MintbaseTransferTx = Record<MintbaseSupportedTxTypes.Transfer, MintbaseTransferTxDetails>

export interface MintbaseMintTxDetails {
    num: number;
    nftContract: string;
}

export interface MintbaseTransferTxDetails {
    tokenId: string;
    nftContract: string;
    receiver: string;
}

export interface MintbaseTxDetails {
    appId: SupportedProtocols.Mintbase
    action: MintbaseSupportedTxAction
    signerId: string
    hash: string
    timestamp: Date
}
