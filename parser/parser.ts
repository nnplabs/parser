import { types } from "near-lake-framework";
import { RabbitMqConnection } from "../rabbitMQ/setup";
import { TxParser } from "./protocols";
import { mintbaseTxParser } from "./protocols/mintbase";

/**
 * 
 * description: Parses a transaction and sends it to the message queue
 * 
 * @param tx 
 * @param timestamp 
 * @param rabbitMqConnection 
 * 
 * @returns void
 */
export const transactionParser = async(tx: types.IndexerTransactionWithOutcome, timestamp: Date, rabbitMqConnection: RabbitMqConnection) => {
    const { transaction } = tx;
    let { actions, signerId, receiverId } = transaction;

    // Parse actions for protocol specific transactions
    // TODO: Add more protocols

    // TODO: Add generic transaction parser for near specific transactions
    const relevantActions: types.FunctionCallAction[] = actions.filter((action) => typeof (action) === "object" && "FunctionCall" in action) as types.FunctionCallAction[];
    if (receiverId.match(/\.mintbase\d+\.near$/)) {
        receiverId = "mintbase.near"
    }

    if (relevantActions.length > 0) {
        const parser = new TxParser(transaction, receiverId, relevantActions, signerId, transaction.hash, timestamp);
        const parsedTx = await parser.parse();

        if (parsedTx) {
            parsedTx.forEach((tx) => {
                rabbitMqConnection.publishMessage(tx);
            });
        }
    }
}