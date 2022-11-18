import { types } from "near-lake-framework";
import { TxDetails } from "./protocol-types";


export enum GenericSupportedEvents {
    Generic = "Generic",
}

export interface GenericStakeDataParams {
    methodName: string;
    contractAddress: string;
    timestamp: string;
}

export declare type GenericTxDetails = {
    appName: string;
    userWalletAddress: string;
    txHash: string;
    eventName: GenericSupportedEvents.Generic
    data: GenericStakeDataParams
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
export const genericTxParser = async (receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];

    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
                const txDetails: TxDetails = {
                    appName: receiverId,
                    data: {
                        methodName: methodName,
                        contractAddress: receiverId,
                        timestamp: timestamp.toDateString(),
                    },
                    eventName: GenericSupportedEvents.Generic,
                    userWalletAddress: signerId,
                    txHash,
                }

                allTxDetails.push(txDetails);
        } catch (error) {
            // console.log(error);
        }
    }

    return allTxDetails;
}

export {
    
}