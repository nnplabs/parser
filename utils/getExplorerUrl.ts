export const getExplorerUrl = (txHash: string, networkId: string = "mainnet") => {
    switch (networkId) {
        case "mainnet":
            return `https://explorer.near.org/transactions/${txHash}`;
        case "testnet":
            return `https://explorer.testnet.near.org/transactions/${txHash}`;
        case "betanet":
            return `https://explorer.betanet.near.org/transactions/${txHash}`;
        case "local":
            return `https://explorer.testnet.near.org/transactions/${txHash}`;
        default:
            throw new Error(`Unrecognized networkId: ${networkId}`);
    }
}