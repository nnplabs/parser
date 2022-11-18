import { GenericTxDetails } from "./genericTxs";
import { LinearProtocolTxDetails } from "./linear-protocol";
import { MetaPoolTxDetails } from "./meta-pool";
import { MintbaseTxDetails } from "./mintbase";
import { RefTxDetails } from "./ref-finance";
import { StaderLabsTxDetails } from "./staderlabs";

export enum SupportedProtocolsTypes {
    RefFinance = "ref-finance.near",
    Mintbase = "mintbase.near",
    LinearProtocol = "linear-protocol.near",
    StaderLabs = "v2-nearx.stader-labs.near",
    MetaPool = "meta-pool.near",
}

export declare type TxDetails = RefTxDetails 
    | MintbaseTxDetails 
    | LinearProtocolTxDetails 
    | MetaPoolTxDetails 
    | StaderLabsTxDetails
    | GenericTxDetails;
