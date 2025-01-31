import {privateKeyToAccount} from "viem/accounts";
import {localnode} from "./config";
import {
    createPublicClient,
    createWalletClient,
    formatEther, http
} from "viem";
import {eip7702Actions} from "viem/experimental";
import {getBalance} from "viem/actions";
import {send7702Tx, send7702TxWithSponsor, sendErc20, sendErc20WithSponsor} from "./7702_basic_tool";
import {getContract} from 'viem'
import {erc20Abi} from "./contract";
import {deployBatchCallContract} from "./deployBatchCall";
import {deployDemoErc20Token} from "./deployDemoErc20";

const account = privateKeyToAccount(localnode.accountPk)

const walletClient = createWalletClient({
    account,
    chain: localnode,
    transport: http(),
}).extend(eip7702Actions())
const pubClient = createPublicClient({
    chain: localnode,
    transport: http(),
});

async function initContract() {
    const batchCallContractAddress = await deployBatchCallContract(localnode.rpcUrls.default.http[0], localnode.accountPk);
    console.log("batchCallContractAddress: " + batchCallContractAddress)
    const tokenAddress = await deployDemoErc20Token(localnode.rpcUrls.default.http[0], localnode.accountPk);
    console.log("tokenContract: " + tokenAddress)

}


async function main() {
    // initContract first!!!
    // send eth
    // const batchCallContractAddress = await deployBatchCallContract(localnode.rpcUrls.default.http[0], localnode.accountPk);
    const batchCallContractAddress = '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1'
    const tokenAddress = '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
    console.log("batchCallContractAddress: " + batchCallContractAddress)
    console.log("tokenContract: " + tokenAddress)
    const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'
    const toAddress2 = '0xd2135CfB216b74109775236E36d4b433F1DF507B'
    const balance1 = await getBalance(pubClient, {address: toAddress1,})
    const balance1Ether = formatEther(balance1)
    console.log("balance1: " + balance1Ether)

    console.log("============= send ETH by SetCode=============")
    /**
     * --------------------  send ETH by SetCode   --------------------
     */
    const txHash = await send7702Tx(walletClient, toAddress1, toAddress2, batchCallContractAddress.toString() as `0x${string}`)
    console.log("send7702Tx tx Hash " + txHash)
    printAllTxInf(txHash)
    console.log("============= send ETH by SetCode WithSponsor =============")
    // send eth with sponsor
    /**
     * --------------------  send ETH by SetCode WithSponsor   --------------------
     */
    const sponsorTxHash = await send7702TxWithSponsor(walletClient, toAddress1, toAddress2, batchCallContractAddress.toString() as `0x${string}`, localnode.sponsorPk)
    console.log("sponsorTxHash " + sponsorTxHash)

    //erc20 token 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
    // mint token
    // transfertoken
    const tokenContract = getContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            client: {public: pubClient, wallet: walletClient}
        }
    )
    tokenContract.write.mint([2000])
    const tokenBalance = await tokenContract.read.balanceOf([
        walletClient.account.address
    ])
    console.log("tokenBalance: " + tokenBalance + " account " + walletClient.account.address)
    //
    // const sendErc20Txhash = await sendErc20(walletClient, toAddress1, tokenAddress, 5, batchCallContractAddress)
    // console.log("sendErc20Txhash " + sendErc20Txhash)
    /**
     * --------------------  send ERC20 Token by SetCode WithSponsor   --------------------
     */
    console.log("============= send ERC20 Token by SetCode WithSponsor  =============")

    const address1tokenBalance = await tokenContract.read.balanceOf([
        toAddress1
    ])
    console.log("address1tokenBalance: " + address1tokenBalance + " account " + toAddress1)
    const sendErc20TxhashWithSponsor = await sendErc20WithSponsor(walletClient, toAddress1, tokenAddress as `0x${string}`, 5, batchCallContractAddress.toString() as `0x${string}`, localnode.sponsorPk)
    console.log("sendErc20TxhashWithSponsor " + sendErc20TxhashWithSponsor)
}

 async function printAllTxInf(txHash: `0x${string}`) {

    const bigIntReplacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
            return value.toString(); // Convert BigInt to string
        }
        return value; // Return other values unchanged
    };// getTx
    const txInfo = await pubClient.getTransaction({hash: txHash})
    console.log("txInfo: " + JSON.stringify(txInfo, bigIntReplacer));

    const txReceipt = await pubClient.getTransactionReceipt({hash: txHash})
    console.log("txReceipt: " + JSON.stringify(txReceipt, bigIntReplacer))

    const trace = await pubClient.request({
        method: "debug_traceTransaction" as any,
        params: [
            txHash, // Transaction hash to trace
            {tracer: "callTracer"} as any, // Tracer configuration
        ],

    });

    console.log("debugInfo: " + JSON.stringify(trace, bigIntReplacer))
}

main()
// printAllTxInf('0xbfd002e275985c155bb4531a748ae390a7fd15c348d77e741ff47baa081cafcf')