import {createPublicClient, http} from "viem";
import {devnet5} from "./config";
export const pubClient = createPublicClient({
    chain: devnet5,
    transport: http(),
});

async function getParam() {
    const chainId = await pubClient.getChainId()
    console.log("chainId: " + chainId)

    const transactionCount = await pubClient.getTransactionCount({
        address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    })
    console.log("account nonce: " + transactionCount)

    const delegateAddress = await pubClient.getTransactionCount({
        address: '0x90464A8880FC0f91e889043cA1e4535D2Dc78888',
    })
    console.log("delegate account nonce: " + delegateAddress)

}

getParam()