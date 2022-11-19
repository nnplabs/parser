import assert from "assert";
import { types } from "near-lake-framework";
import { getExplorerUrl } from "../../utils/getExplorerUrl";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum MintbaseSupportedEvents {
    Mint = "Mint",
    Send = "Send",
    Receive = "Receive"
}

export interface MintbaseMintDataParams {
    num: number;
    nftContract: string;
    timestamp: string;
    txUrl: string;
}

export interface MintbaseSendDataParams {
    tokenId: string;
    nftContract: string;
    receiver: string;
    timestamp: string;
    txUrl: string;
}

export interface MintbaseReceiveDataParams {
    tokenId: string;
    nftContract: string;
    sender: string;
    timestamp: string;
    txUrl: string;
}

export declare type MintbaseMintTxData = {
    eventName: MintbaseSupportedEvents.Mint
    data: MintbaseMintDataParams
}

export declare type MintbaseSendTxData = {
    eventName: MintbaseSupportedEvents.Send
    data: MintbaseSendDataParams
}

export declare type MintbaseReceiveTxData = {
    eventName: MintbaseSupportedEvents.Receive
    data: MintbaseReceiveDataParams
}

export declare type MintbaseTxData = MintbaseMintTxData | MintbaseSendTxData | MintbaseReceiveTxData;

export declare type MintbaseTxDetails = MintbaseTxData & {
    appName: SupportedProtocolsTypes.Mintbase;
    userWalletAddress: string;
    txHash: string;
    contractAddress: string;
}

/**
 * @param receiverId contract where the transaction was sent
 * @param actions actions of the transaction
 * @param signerId signer of the transaction
 * @param txHash tx
 * @param timestamp timestamp of the transaction
 * 
 * @returns array of tx details
 */
export const mintbaseTxParser = async (transaction: types.Transaction,  receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    assert(receiverId == "mintbase.near");
    const contractAddress = transaction.receiverId;

    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            if (methodName == 'nft_transfer') {
                const sendTxDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.Mintbase,
                    data: {
                        tokenId: args.token_id,
                        receiver: args.receiver_id,
                        nftContract: contractAddress,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    eventName: MintbaseSupportedEvents.Send,
                    userWalletAddress: signerId,
                    txHash,
                    contractAddress
                }

                const receiveTxDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.Mintbase,
                    data: {
                        tokenId: args.token_id,
                        sender: args.receiver_id,
                        nftContract: contractAddress,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    eventName: MintbaseSupportedEvents.Receive,
                    userWalletAddress: signerId,
                    txHash,
                    contractAddress
                }
                allTxDetails.push(sendTxDetails);
                allTxDetails.push(receiveTxDetails);
            } else if (methodName == 'nft_batch_mint') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.Mintbase,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: MintbaseSupportedEvents.Mint,
                    data: {
                        num: args.num_to_mint,
                        nftContract: contractAddress,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress
                }
                allTxDetails.push(txDetails);
            }
        } catch (error) {
            // console.log(error);
        }
    }
    return allTxDetails;
}