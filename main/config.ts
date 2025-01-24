import {defineChain} from "viem";

export const devnet5 = /*#__PURE__*/ defineChain({
    id: 7088110746,
    name: 'DEVNET5',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.pectra-devnet-5.ethpandaops.io']},
    },
    //0x7C0EA167B05a85c6E6ce7E919983AF3f3CEa379E
    accountPk:'0x1e10b33439feb36a642fd48440def1dd2c5ff4c02ffbcf4b6d1c1e867fc0da6e'
})