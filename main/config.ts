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
export const localnode = /*#__PURE__*/ defineChain({
    id: 31337,
    name: 'LOCAL',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545']},
    },
    //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    accountPk:'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    //0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    sponsorPk :'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
})