import assert from "assert";
import { types } from "near-lake-framework";
import { getExplorerUrl } from "../../utils/getExplorerUrl";
import { formatTokenAmountByAddress } from "../../utils/getTokenMetaData";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum LinearProtocolSupportedEvents {
    Stake = "Stake",
    Unstake = "Unstake",
    Withdraw = "Withdraw"
}

export interface LinearProtocolStakeDataParams {
    deposit: string;
    timestamp: string;
    txUrl: string;
}

export interface LinearProtocolUnstakeDataDetails {
    amount: string;
    timestamp: string;
    txUrl: string;
}

export interface LinearProtocolWithdrawDataParams {
    amount: string;
    timestamp: string;
    txUrl: string;
}

export declare type LinearProtocolStakeTxData = {
    eventName: LinearProtocolSupportedEvents.Stake
    data: LinearProtocolStakeDataParams
}

export declare type LinearProtocolUnstakeTxData = {
    eventName: LinearProtocolSupportedEvents.Unstake
    data: LinearProtocolUnstakeDataDetails
}

export declare type LinearProtocolWithdrawTxData = {
    eventName: LinearProtocolSupportedEvents.Withdraw
    data: LinearProtocolWithdrawDataParams
}

export declare type LinearProtocolTxData = LinearProtocolStakeTxData | LinearProtocolUnstakeTxData | LinearProtocolWithdrawTxData;

export declare type LinearProtocolTxDetails = LinearProtocolTxData & {
    appName: SupportedProtocolsTypes.LinearProtocol;
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
export const linearProtocolTxParser = async (_transaction: types.Transaction, receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    assert(receiverId == "linear-protocol.near");

    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            if (methodName == 'deposit_and_stake') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.LinearProtocol,
                    data: {
                        deposit: `${formatTokenAmountByAddress(receiverId, args.deposit_token)} Near`,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress: receiverId,
                    eventName: LinearProtocolSupportedEvents.Stake,
                    userWalletAddress: signerId,
                    txHash,
                }

                allTxDetails.push(txDetails);
            } else if (methodName == 'unstake' || methodName == 'unstake_all') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.LinearProtocol,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: LinearProtocolSupportedEvents.Unstake,
                    data: {
                        amount: methodName == 'unstake' ? `${formatTokenAmountByAddress(receiverId, args.args_json.amount)} Near` : "all staked Near",
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress: receiverId,
                }
                allTxDetails.push(txDetails);
            } else if (methodName == 'withdraw_all') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.LinearProtocol,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: LinearProtocolSupportedEvents.Withdraw,
                    data: {
                        amount: `all unstaked Near`,
                        timestamp: timestamp.toDateString(),
                        txUrl: getExplorerUrl(txHash)
                    },
                    contractAddress: receiverId,
                }
                allTxDetails.push(txDetails);
            }
        } catch (error) {
            // console.log(error);
        }
    }

    return allTxDetails;
}