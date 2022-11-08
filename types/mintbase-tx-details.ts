import { SupportedProtocols } from "./supported-protocols";

export enum MintbaseSupportedEvents {
    Mint = "Mint",
    Send = "Send",
    Receive = "Receive"
}

export interface MintbaseMintTxDetails {
    num: number;
    nftContract: string;
}

export interface MintbaseSendTxDetails {
    tokenId: string;
    nftContract: string;
    receiver: string;
}

export interface MintbaseReceiveTxDetails {
    tokenId: string;
    nftContract: string;
    sender: string;
}

export declare type MintbaseMintTxData = {
    eventName: MintbaseSupportedEvents.Mint
    data: MintbaseMintTxDetails
}

export declare type MintbaseSendTxData = {
    eventName: MintbaseSupportedEvents.Send
    data: MintbaseSendTxDetails
}

export declare type MintbaseReceiveTxData = {
    eventName: MintbaseSupportedEvents.Receive
    data: MintbaseReceiveTxDetails
}

export declare type MintbaseTxData = MintbaseMintTxData | MintbaseSendTxData | MintbaseReceiveTxData;

export declare type MintbaseTxDetails = MintbaseTxData & {
    appName: SupportedProtocols.Mintbase;
    userWalletAddress: string;
    hash: string;
    timestamp: Date;
}
