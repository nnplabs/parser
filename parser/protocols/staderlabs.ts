import assert from "assert";
import { types } from "near-lake-framework";
import { getExplorerUrl } from "../../utils/getExplorerUrl";
import { formatTokenAmountByAddress } from "../../utils/getTokenMetaData";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum StaderLabsSupportedEvents {
    Stake = "Stake",
    Unstake = "Unstake",
    Withdraw = "Withdraw"
}

export interface StaderLabsStakeDataParams {
    deposit: string;
    timestamp: string;
    txUrl: string;
}

export interface StaderLabsUnstakeDataDetails {
    amount: string;
    timestamp: string;
    txUrl: string;
}

export interface StaderLabsWithdrawDataParams {
    amount: string;
    timestamp: string;
    txUrl: string;
}

export declare type StaderLabsStakeTxData = {
    eventName: StaderLabsSupportedEvents.Stake
    data: StaderLabsStakeDataParams
}

export declare type StaderLabsUnstakeTxData = {
    eventName: StaderLabsSupportedEvents.Unstake
    data: StaderLabsUnstakeDataDetails
}

export declare type StaderLabsWithdrawTxData = {
    eventName: StaderLabsSupportedEvents.Withdraw
    data: StaderLabsWithdrawDataParams
}

export declare type StaderLabsTxData = StaderLabsStakeTxData | StaderLabsUnstakeTxData | StaderLabsWithdrawTxData;

export declare type StaderLabsTxDetails = StaderLabsTxData & {
    appName: SupportedProtocolsTypes.StaderLabs;
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
export const staderlabsTxParser = async (_transaction: types.Transaction, receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    assert(receiverId == "v2-nearx.stader-labs.near");

    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            if (methodName == 'deposit_and_stake') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.StaderLabs,
                    data: {
                        deposit: `${formatTokenAmountByAddress(receiverId, args.deposit_token)} Near`,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    eventName: StaderLabsSupportedEvents.Stake,
                    userWalletAddress: signerId,
                    txHash,
                    contractAddress: receiverId
                }

                allTxDetails.push(txDetails);
            } else if (methodName == 'unstake' || methodName == 'unstake_all') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.StaderLabs,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: StaderLabsSupportedEvents.Unstake,
                    data: {
                        amount: methodName == 'unstake' ? `${formatTokenAmountByAddress(receiverId, args.args_json.amount)} Near` : "all staked Near",
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress: receiverId
                }
                allTxDetails.push(txDetails);
            } else if (methodName == 'withdraw' || methodName == 'withdraw_all') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.StaderLabs,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: StaderLabsSupportedEvents.Withdraw,
                    data: {
                        amount: `${formatTokenAmountByAddress(receiverId, args.args_json.withdraw)} Near`,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress: receiverId
                }
                allTxDetails.push(txDetails);
            }
        } catch (error) {
            // console.log(error);
        }
    }

    return allTxDetails;
}

export {
    
}