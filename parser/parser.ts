import { types } from "near-lake-framework";
import { refFinanceTxParser } from "./protocols";

export const transactionParser = (tx: types.IndexerTransactionWithOutcome, timestamp: Date) => {
    const { transaction } = tx;
    const { actions } = transaction;

    // Parse actions for protocol specific transactions
    // TODO: Add more protocols

    // TODO: Add generic transaction parser for near specific transactions
    const relevantActions: types.FunctionCallAction[] = actions.filter((action) => typeof (action) === "object" && "FunctionCall" in action) as types.FunctionCallAction[];
    
    if (relevantActions.length > 0) {
        refFinanceTxParser(relevantActions, transaction.signerId, transaction.hash, timestamp);
    }
}