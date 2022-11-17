import assert from "assert";
import { types } from "near-lake-framework";
import { RabbitMqConnection } from "../../rabbitMQ/setup";
import { RefSupportedEvents } from "../../types/ref-tx-details";
import { SupportedProtocols } from "../../types/supported-protocols";
import { TxDetails } from "../../types/tx-details";
import { formatTokenAmountByAddress, formatTokenAmountBySymbol, getTokenSymbol } from "../../utils/getTokenMetaData";

export const refFinanceTxParser = async(actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date, rabbitMqConnection: RabbitMqConnection): Promise<void> => {
    actions.forEach(async (action) => {
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            assert(args.receiver_id == "v2.ref-finance.near")
            
            if (methodName == 'ft_transfer_call' && args.msg) {
                const parsedMsg = JSON.parse(args.msg);
                const {token_in} = parsedMsg.actions[0];
                const {token_out, min_amount_out} = parsedMsg.actions.at(-1);
                
                const txDetails: TxDetails = {
                    appName: SupportedProtocols.RefFinance,
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
                // console.log(txDetails);
                rabbitMqConnection.publishMessage(txDetails);
                return;
            } else if (methodName in ['add_stable_liquidity', 'add_liquidity']) {
                const poolId = args.args_json.pool_id;
                const poolDetails: any = await fetch('https://indexer.ref.finance/get-pool?pool_id=' + poolId)
                const { token_symbols } = poolDetails;

                const txDetails: TxDetails = {
                    appName: SupportedProtocols.RefFinance,
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

                // console.log(txDetails);
                rabbitMqConnection.publishMessage(txDetails);
                return
            } else if (methodName in ['remove_liquidity_by_tokens', 'remove_liquidity']) {
                const poolId = args.args_json.pool_id;
                const poolDetails: any = await fetch('https://indexer.ref.finance/get-pool?pool_id=' + poolId)
                const { token_symbols } = poolDetails;

                const txDetails: TxDetails = {
                    appName: SupportedProtocols.RefFinance,
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

                // console.log(txDetails);
                rabbitMqConnection.publishMessage(txDetails);
                return;
            }
        } catch (e) {
            // console.log(e);
        }
    })
}