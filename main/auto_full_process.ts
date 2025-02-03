import {privateKeyToAccount} from "viem/accounts";
import {createPublicClient, createWalletClient, encodeFunctionData, formatEther, http, parseEther} from "viem";
import {devnet5} from "./config";
import {eip7702Actions} from "viem/experimental";
import {send7702Tx} from "./7702_basic_tool";
import {getBalance, getChainId, getTransaction} from "viem/actions";
import {batchCallAbi} from "./contract";

export const account = privateKeyToAccount(devnet5.accountPk)


 const pubClient = createPublicClient({
    chain: devnet5,
    transport: http(),
});


async function main() {
    const walletClient = createWalletClient({
        account,
        chain: devnet5,
        transport: http(),
    }).extend(eip7702Actions())


}


main()