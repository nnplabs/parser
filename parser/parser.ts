import { types } from "near-lake-framework";
import { RabbitMqConnection } from "../rabbitMQ/setup";
import { mintbaseTxParser, refFinanceTxParser } from "./protocols";

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
    const { actions } = transaction;

    // Parse actions for protocol specific transactions
    // TODO: Add more protocols

    // TODO: Add generic transaction parser for near specific transactions
    const relevantActions: types.FunctionCallAction[] = actions.filter((action) => typeof (action) === "object" && "FunctionCall" in action) as types.FunctionCallAction[];
    
    if (relevantActions.length > 0) {
        await refFinanceTxParser(relevantActions, transaction.signerId, transaction.hash, timestamp, rabbitMqConnection);
        await mintbaseTxParser(transaction, relevantActions, transaction.signerId, transaction.hash, timestamp, rabbitMqConnection);
    }
}