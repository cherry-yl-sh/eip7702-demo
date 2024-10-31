import {defineChain} from "viem";

export const devnet4 = /*#__PURE__*/ defineChain({
    id: 7042905162,
    name: 'DEVNET4',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.pectra-devnet-4.ethpandaops.io']},
    },
})