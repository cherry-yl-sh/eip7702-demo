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
    //
    accountPk:''
})

export const odyssey = /*#__PURE__*/ defineChain({
    id: 911867,
    name: 'odyssey',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://odyssey.ithaca.xyz']},
    },
    accountPk:''
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
    //0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
    safePrivateKey:'0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
    //0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    sponsorPk :'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
})