import {createPublicClient, http} from "viem";
import {devnet4} from "./config";
export const pubClient = createPublicClient({
    chain: devnet4,
    transport: http(),
});

async function getParam() {
    const chainId = await pubClient.getChainId()
    console.log("chainId: " + chainId)

    const transactionCount = await pubClient.getTransactionCount({
        address: '0x3e918Eb72702C3370CcdF6E1d13d68ADB3CC0123',
    })
    console.log("account nonce: " + transactionCount)

    const delegateAddress = await pubClient.getTransactionCount({
        address: '0x90464A8880FC0f91e889043cA1e4535D2Dc78888',
    })
    console.log("delegate account nonce: " + delegateAddress)

}

getParam()