import { types } from "near-lake-framework";
import { genericTxParser } from "./genericTxs";
import { SupportedProtocolsMapping } from "./protocol-mappings";

export class TxParser {
    receiverId: string;
    actions: types.FunctionCallAction[];
    signerId: string;
    txHash: string;
    timestamp: Date;

    constructor (receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date) {
        this.receiverId = receiverId;
        this.actions = actions;
        this.signerId = signerId;
        this.txHash = txHash;
        this.timestamp = timestamp;
    }

    async parse() {
        let parser = genericTxParser;

        if (this.receiverId in SupportedProtocolsMapping) {
            parser = SupportedProtocolsMapping[this.receiverId];
        }
        
        return await parser(this.receiverId, this.actions, this.signerId, this.txHash, this.timestamp);
    }
}