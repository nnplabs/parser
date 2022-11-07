import assert from "assert";
import { types } from "near-lake-framework";
import { RabbitMqConnection } from "../../rabbitMQ/setup";
import { SupportedProtocols } from "../../types/supported-protocols";
import { TxDetails } from "../../types/tx-details";

export const mintbaseTxParser = async (tx: types.Transaction, actions: types.FunctionCallAction[], signerId: string, hash: string, timestamp: Date, rabbitMqConnection: RabbitMqConnection) => {
    actions.forEach(async (action) => {
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        const { receiverId, signerId } = tx;
        try {
            assert(receiverId.match(/\.mintbase\d+\.near$/));
            const args = JSON.parse(Buffer.from(_encodedArgs, 'base64').toString('utf8'))
            if (methodName == 'nft_transfer') {
                const txDetails: TxDetails = {
                    appId: SupportedProtocols.Mintbase,
                    action: {
                        "transfer": {
                            tokenId: args.token_id,
                            receiver: args.receiver_id,
                            nftContract: receiverId,
                        }
                    },
                    signerId,
                    hash,
                    timestamp
                }
                console.log(txDetails);
                // rabbitMqConnection.channel.sendToQueue("nnp-msg-queue", Buffer.from(JSON.stringify(txDetails)), { persistent: true });
                return;
            } else if (methodName == 'nft_batch_mint') {
                const txDetails: TxDetails = {
                    appId: SupportedProtocols.Mintbase,
                    action: {
                        "mint": {
                            num: args.num_to_mint,
                            nftContract: receiverId,
                        }
                    },
                    signerId,
                    hash,
                    timestamp
                }
                console.log(txDetails);
                // rabbitMqConnection.channel.sendToQueue("nnp-msg-queue", Buffer.from(JSON.stringify(txDetails)), { persistent: true });
                return;
            }
            // console.log(args);
            if (hash == "2kK9KssUAjgo65yraY8dWtUDet1WWY4KR2w1Vi1pdXjP") {
                console.log(action, args, signerId, JSON.stringify(tx));
            }
        } catch (error) {
            // console.log(error);
        }
    });
}