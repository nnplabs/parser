import { types } from "near-lake-framework";
import { SupportedProtocols } from "../../types/supported-protocols";
import { TxDetails } from "../../types/tx-details";

export const refFinanceTxParser = (actions: types.FunctionCallAction[], signerId: string, hash: string, timestamp: Date) => {
    actions.forEach((action) => {
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            if (methodName == 'ft_transfer_call' && args.receiver_id == "v2.ref-finance.near" && args.msg) {
                const parsedMsg = JSON.parse(args.msg);
                const {token_in} = parsedMsg.actions[0];
                const {token_out, min_amount_out} = parsedMsg.actions.at(-1);
                
                const txDetails: TxDetails = {
                    appId: SupportedProtocols.RefFinance,
                    action: {
                        "swap": {
                            token_sold: token_in,
                            token_bought: token_out,
                            amount_sold: args.amount,
                            amount_bought: min_amount_out,
                        }
                    },
                    signerId,
                    hash,
                    timestamp
                }
                console.log(txDetails);
                return true
            }
        } catch (e) {
            return false;
        }
    })
}