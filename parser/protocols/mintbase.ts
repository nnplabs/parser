import assert from "assert";
import { types } from "near-lake-framework";
import { RabbitMqConnection } from "../../rabbitMQ/setup";
import { MintbaseSupportedEvents } from "../../types/mintbase-tx-details";
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
                const sendTxDetails: TxDetails = {
                    appName: SupportedProtocols.Mintbase,
                    data: {
                        tokenId: args.token_id,
                        receiver: args.receiver_id,
                        nftContract: receiverId
                    },
                    eventName: MintbaseSupportedEvents.Send,
                    userWalletAddress: signerId,
                    hash,
                    timestamp
                }
                const receiveTxDetails: TxDetails = {
                    appName: SupportedProtocols.Mintbase,
                    data: {
                        tokenId: args.token_id,
                        sender: args.receiver_id,
                        nftContract: receiverId
                    },
                    eventName: MintbaseSupportedEvents.Receive,
                    userWalletAddress: signerId,
                    hash,
                    timestamp
                }
                // console.log(txDetails);
                rabbitMqConnection.publishMessage(sendTxDetails);
                rabbitMqConnection.publishMessage(receiveTxDetails);
                return;
            } else if (methodName == 'nft_batch_mint') {
                const txDetails: TxDetails = {
                    appName: SupportedProtocols.Mintbase,
                    userWalletAddress: signerId,
                    hash,
                    timestamp,
                    eventName: MintbaseSupportedEvents.Mint,
                    data: {
                        num: args.num_to_mint,
                        nftContract: receiverId
                    }
                }
                // console.log(txDetails);
                rabbitMqConnection.publishMessage(txDetails);
                return;
            }
        } catch (error) {
            // console.log(error);
        }
    });
}