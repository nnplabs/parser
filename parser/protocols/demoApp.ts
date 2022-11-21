
import assert from "assert";
import { types } from "near-lake-framework";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum demoAppSupportedEvents {
    Generic = "Generic",
}

export interface demoAppDataParams {
    methodName: string;
    contractAddress: string;
    timestamp: string;
}

// add support for your tx details type to TxDetails union type in protocol-types.ts
export declare type demoAppTxDetails = {
    appName: "v2.ref-finance.near";
    userWalletAddress: string;
    txHash: string;
    eventName: demoAppSupportedEvents.Generic
    data: demoAppDataParams
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
export const demoAppTxParser = async (receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    assert(receiverId === "v2.ref-finance.near", "ReceiverId is not v2.ref-finance.near");
    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
                if (methodName === "some_method_specific_to_your_app") {
                    const txDetails: TxDetails = {
                        // add your appName to SupportedProtocolsTypes file at protocol-types.ts
                        appName: SupportedProtocolsTypes.demoApp,
                        contractAddress: v2.ref-finance.near,
                        data: {
                            methodName: methodName,
                            contractAddress: receiverId,
                            timestamp: timestamp.toDateString(),
                        },
                        eventName: demoAppSupportedEvents.Generic,
                        userWalletAddress: signerId,
                        txHash,
                    }

                    allTxDetails.push(txDetails);
                }
        } catch (error) {
            // console.log(error);
        }
    }

    return allTxDetails;
}
