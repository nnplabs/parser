import { types } from "near-lake-framework";
import { getExplorerUrl } from "../../utils/getExplorerUrl";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";


export enum GenericSupportedEvents {
    Generic = "Generic",
}

export interface GenericDataParams {
    methodName: string;
    contractAddress: string;
    txUrl: string;
    timestamp: string;
}

export declare type GenericTxDetails = {
    appName: string;
    contractAddress: string;
    userWalletAddress: string;
    txHash: string;
    eventName: GenericSupportedEvents.Generic
    data: GenericDataParams
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
export const genericTxParser = async (_transaction: types.Transaction, receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];

    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.DemoApp,
                    data: {
                        methodName: methodName,
                        contractAddress: receiverId,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress: receiverId,
                    eventName: GenericSupportedEvents.Generic,
                    userWalletAddress: signerId,
                    txHash,
                }

                allTxDetails.push(txDetails);
        } catch (error) {
            console.log(error);
        }
    }

    return allTxDetails;
}

export {
    
}