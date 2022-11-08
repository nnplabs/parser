import assert from "assert";
import { types } from "near-lake-framework";
import { RabbitMqConnection } from "../../rabbitMQ/setup";
import { RefSupportedEvents } from "../../types/ref-tx-details";
import { SupportedProtocols } from "../../types/supported-protocols";
import { TxDetails } from "../../types/tx-details";

export const refFinanceTxParser = async(actions: types.FunctionCallAction[], signerId: string, hash: string, timestamp: Date, rabbitMqConnection: RabbitMqConnection): Promise<void> => {
    actions.forEach(async (action) => {
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            assert(args.receiver_id == "v2.ref-finance.near")
            
            if (methodName == 'ft_transfer_call' && args.receiver_id == "v2.ref-finance.near" && args.msg) {
                const parsedMsg = JSON.parse(args.msg);
                const {token_in} = parsedMsg.actions[0];
                const {token_out, min_amount_out} = parsedMsg.actions.at(-1);
                
                const txDetails: TxDetails = {
                    appName: SupportedProtocols.RefFinance,
                    userWalletAddress: signerId,
                    hash,
                    timestamp,
                    eventName: RefSupportedEvents.Swap,
                    data: {
                        token_sold: token_in,
                        token_bought: token_out,
                        amount_sold: args.amount,
                        amount_bought: min_amount_out,
                    },
                }
                // console.log(txDetails);
                rabbitMqConnection.publishMessage(txDetails);
                return;
            } else if (methodName in ['add_stable_liquidity', 'add_liquidity'] && args.receiver_id == "v2.ref-finance.near") {
                const poolId = args.args_json.pool_id;
                const poolDetails: any = await fetch('https://indexer.ref.finance/get-pool?pool_id=' + poolId)
                const { token_symbols } = poolDetails;

                const txDetails: TxDetails = {
                    appName: SupportedProtocols.RefFinance,
                    userWalletAddress: signerId,
                    hash,
                    timestamp,
                    eventName: RefSupportedEvents.AddLiquidity,
                    data: {
                        tokenList: token_symbols ?? [],
                        amountList: args.args_json.amounts,
                        poolId,
                    }
                }

                // console.log(txDetails);
                rabbitMqConnection.publishMessage(txDetails);
                return
            } else if (methodName in ['remove_liquidity_by_tokens', 'remove_liquidity'] && args.receiver_id == "v2.ref-finance.near") {
                const poolId = args.args_json.pool_id;
                const poolDetails: any = await fetch('https://indexer.ref.finance/get-pool?pool_id=' + poolId)
                const { token_symbols } = poolDetails;

                const txDetails: TxDetails = {
                    appName: SupportedProtocols.RefFinance,
                    userWalletAddress: signerId,
                    hash,
                    timestamp,
                    eventName: RefSupportedEvents.RemoveLiquidity,
                    data: {
                        amountList: args.args_json.amounts ?? args.args_json.min_amounts ?? [],
                        tokenList: token_symbols ?? [],
                        poolId: args.args_json.pool_id
                    }
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