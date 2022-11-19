import { GenericTxDetails } from "./genericTxs";
import { LinearProtocolTxDetails } from "./linear-protocol";
import { MetaPoolTxDetails } from "./meta-pool";
import { MintbaseTxDetails } from "./mintbase";
import { RefTxDetails } from "./ref-finance";
import { StaderLabsTxDetails } from "./staderlabs";

export enum SupportedProtocolsTypes {
    RefFinance = "RefFinance",
    Mintbase = "MintBase",
    LinearProtocol = "LinearProtocol",
    StaderLabs = "StaderLabs",
    MetaPool = "MetaPool",
    DemoApp = "Demo App"
}

export declare type TxDetails = RefTxDetails 
    | MintbaseTxDetails 
    | LinearProtocolTxDetails 
    | MetaPoolTxDetails 
    | StaderLabsTxDetails
    | GenericTxDetails;
