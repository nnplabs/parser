import assert from "assert";
import { types } from "near-lake-framework";
import { formatTokenAmountByAddress } from "../../utils/getTokenMetaData";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum MetaPoolSupportedEvents {
    Stake = "Stake",
    Unstake = "Unstake",
    Withdraw = "Withdraw"
}

export interface MetaPoolStakeDataParams {
    deposit: string;
    timestamp: string;
}

export interface MetaPoolUnstakeDataDetails {
    amount: string;
    timestamp: string;
}

export interface MetaPoolWithdrawDataParams {
    amount: string;
    timestamp: string;
}

export declare type MetaPoolStakeTxData = {
    eventName: MetaPoolSupportedEvents.Stake
    data: MetaPoolStakeDataParams
}

export declare type MetaPoolUnstakeTxData = {
    eventName: MetaPoolSupportedEvents.Unstake
    data: MetaPoolUnstakeDataDetails
}

export declare type MetaPoolWithdrawTxData = {
    eventName: MetaPoolSupportedEvents.Withdraw
    data: MetaPoolWithdrawDataParams
}

export declare type MetaPoolTxData = MetaPoolStakeTxData | MetaPoolUnstakeTxData | MetaPoolWithdrawTxData;

export declare type MetaPoolTxDetails = MetaPoolTxData & {
    appName: SupportedProtocolsTypes.MetaPool;
    userWalletAddress: string;
    txHash: string;
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
export const metaPoolTxParser = async (receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    assert(receiverId == "meta-pool.near");

    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            if (methodName == 'deposit_and_stake') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.MetaPool,
                    data: {
                        deposit: `${formatTokenAmountByAddress(receiverId, args.deposit_token)} Near`,
                        timestamp: timestamp.toDateString(),
                    },
                    eventName: MetaPoolSupportedEvents.Stake,
                    userWalletAddress: signerId,
                    txHash,
                }

                allTxDetails.push(txDetails);
            } else if (methodName == 'unstake' || methodName == 'unstake_all') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.MetaPool,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: MetaPoolSupportedEvents.Unstake,
                    data: {
                        amount: methodName == 'unstake' ? `${formatTokenAmountByAddress(receiverId, args.args_json.amount)} Near` : "all staked Near",
                        timestamp: timestamp.toDateString(),
                    }
                }
                allTxDetails.push(txDetails);
            } else if (methodName == 'withdraw_all' || methodName == 'withdraw' || methodName == 'withdraw_unstaked') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.MetaPool,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: MetaPoolSupportedEvents.Withdraw,
                    data: {
                        amount: `all unstaked Near`,
                        timestamp: timestamp.toDateString(),
                    }
                }
                allTxDetails.push(txDetails);
            }
        } catch (error) {
            // console.log(error);
        }
    }

    return allTxDetails;
}