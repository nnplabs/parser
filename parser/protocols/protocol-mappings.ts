import { types } from "near-lake-framework";
import { linearProtocolTxParser } from "./linear-protocol";
import { metaPoolTxParser } from "./meta-pool";
import { mintbaseTxParser } from "./mintbase";
import { TxDetails } from "./protocol-types";
import { refFinanceTxParser } from "./ref-finance";
import { staderlabsTxParser } from "./staderlabs";

export const SupportedProtocolsMapping: Record<string,  (receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date) => Promise<TxDetails[]>>= {
    "ref-finance.near": refFinanceTxParser,
    "mintbase.near": mintbaseTxParser,
    "v2-nearx.stader-labs.near": staderlabsTxParser,
    "meta-pool.near": metaPoolTxParser,
    "linear-protocol.near": linearProtocolTxParser,
};