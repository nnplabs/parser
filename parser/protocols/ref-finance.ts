import assert from "assert";
import { types } from "near-lake-framework";
import { formatTokenAmountByAddress, formatTokenAmountBySymbol, getTokenSymbol } from "../../utils/getTokenMetaData";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum RefSupportedEvents {
    Swap = "Swap",
    AddLiquidity = "Add Liquidity",
    RemoveLiquidity = "Remove Liquidity",
}

export interface RefSwapDataParams {
    token_sold: string;
    token_bought: string;
    amount_sold: string;
    amount_bought: string;
    timestamp: string;
}

export interface RefAddLiquidityDataParams {
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
    poolId: string;
    timestamp: string;
}

export interface RefRemoveLiquidityDataParams {
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
    poolId: string;
    timestamp: string;
}

export declare type RefSwapTxData = {
    eventName: RefSupportedEvents.Swap
    data: RefSwapDataParams
}

export declare type RefAddLiquidityTxData = {
    eventName: RefSupportedEvents.AddLiquidity
    data: RefAddLiquidityDataParams
}

export declare type RefRemoveLiquidityTxData = {
    eventName: RefSupportedEvents.RemoveLiquidity
    data: RefRemoveLiquidityDataParams
}

export declare type RefTxData = RefSwapTxData | RefAddLiquidityTxData | RefRemoveLiquidityTxData;

export declare type RefTxDetails = RefTxData & {
    appName: SupportedProtocolsTypes.RefFinance;
    userWalletAddress: string;
    txHash: string;
    apiKey: string;
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
export const refFinanceTxParser = async(_transaction: types.Transaction, receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    console.log(actions)
    assert(receiverId == "v2.ref-finance.near")
    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            
            if (methodName == 'ft_transfer_call' && args.msg) {
                const parsedMsg = JSON.parse(args.msg);
                const {token_in} = parsedMsg.actions[0];
                const {token_out, min_amount_out} = parsedMsg.actions.at(-1);
                
                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.RefFinance,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: RefSupportedEvents.Swap,
                    data: {
                        token_sold: getTokenSymbol(token_in),
                        token_bought: getTokenSymbol(token_out),
                        amount_sold: formatTokenAmountByAddress(token_in, args.amount),
                        amount_bought: formatTokenAmountByAddress(token_out, min_amount_out),
                        timestamp: timestamp.toDateString(),
                    },
                    apiKey: process.env.REF_API_KEY ?? "",
                }
                allTxDetails.push(txDetails);
            } else if (methodName in ['add_stable_liquidity', 'add_liquidity']) {
                const poolId = args.args_json.pool_id;
                const poolDetails: any = await fetch('https://indexer.ref.finance/get-pool?pool_id=' + poolId)
                const { token_symbols } = poolDetails;

                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.RefFinance,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: RefSupportedEvents.AddLiquidity,
                    data: {
                        tokenA: token_symbols?.length > 1 ? token_symbols[0] : '',
                        tokenB: token_symbols?.length > 2 ? token_symbols[1] : '',
                        amountA: args.args_json.amount?.length > 1 ? formatTokenAmountBySymbol(token_symbols[0], args.args_json.amount[0]) : '',
                        amountB: args.args_json.amount?.length > 2 ? formatTokenAmountBySymbol(token_symbols[1], args.args_json.amount[1]) : '',
                        poolId,
                        timestamp: timestamp.toDateString(),
                    },
                    apiKey: process.env.REF_API_KEY ?? "",
                }
                allTxDetails.push(txDetails);
            } else if (methodName in ['remove_liquidity_by_tokens', 'remove_liquidity']) {
                const poolId = args.args_json.pool_id;
                const poolDetails: any = await fetch('https://indexer.ref.finance/get-pool?pool_id=' + poolId)
                const { token_symbols } = poolDetails;

                const txDetails: TxDetails = {
                    appName: SupportedProtocolsTypes.RefFinance,
                    userWalletAddress: signerId,
                    txHash,
                    eventName: RefSupportedEvents.RemoveLiquidity,
                    data: {
                        tokenA: token_symbols?.length > 1 ? token_symbols[0] : '',
                        tokenB: token_symbols?.length > 2 ? token_symbols[1] : '',
                        amountA: args.args_json.amounts?.length > 1 ? formatTokenAmountBySymbol(token_symbols[0], args.args_json.amounts[0]) : '',
                        amountB: args.args_json.amounts?.length > 2 ? formatTokenAmountBySymbol(token_symbols[0], args.args_json.amounts[0]) : '',
                        poolId: args.args_json.pool_id,
                        timestamp: timestamp.toDateString(),
                    },
                    apiKey: process.env.REF_API_KEY ?? "",
                }
                allTxDetails.push(txDetails);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return allTxDetails;
}