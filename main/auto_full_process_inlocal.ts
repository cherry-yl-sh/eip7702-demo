import {privateKeyToAccount} from "viem/accounts";
import {localnode} from "./config";
import {
    createPublicClient,
    createWalletClient,
    encodeFunctionData,
    formatEther,
    http,
    parseEther
} from "viem";
import {eip7702Actions} from "viem/experimental";
import {getBalance} from "viem/actions";
import {send7702Tx, send7702TxWithSponsor} from "./7702_basic_tool";
import {getContract} from 'viem'
import {batchCallAbi, erc20Abi} from "./contract";

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


async function main() {
    // deploy batchCallContractAddress first!!!
    // send eth
    const batchCallContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
    const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'
    const toAddress2 = '0xd2135CfB216b74109775236E36d4b433F1DF507B'
    const balance1 = await getBalance(pubClient, {address: toAddress1,})
    const balance1Ether = formatEther(balance1)

    console.log("balance1: " + balance1Ether)

    // const txHash = await send7702Tx(walletClient,toAddress1,toAddress2, batchCallContractAddress)
    // console.log("tx Hash "+ txHash)
    // gettx 0xc02461c704975a2b76cd887dad138b85c8b8e2ed7457b101ea89a6585374cbfc
    // getrecepit 0xc02461c704975a2b76cd887dad138b85c8b8e2ed7457b101ea89a6585374cbfc
    // debug 0xc02461c704975a2b76cd887dad138b85c8b8e2ed7457b101ea89a6585374cbfc

    // send eth with sponsor

    // const sponsorTxHash = await send7702TxWithSponsor(walletClient,toAddress1,toAddress2, batchCallContractAddress, localnode.sponsorPk )

    // console.log("sponsorTxHash "+ sponsorTxHash)

    //erc20 token 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
    // mint token
    // transfertoken
    const tokenAddress  ='0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
    const tokenContract = getContract({
            address: tokenAddress,
            abi: erc20Abi,
            client: {public: pubClient, wallet: walletClient}
        }
    )
    tokenContract.write.mint([2000])
    const tokenBalance = await tokenContract.read.balanceOf([
        walletClient.account.address
    ])
    console.log("tokenBalance: " + tokenBalance + " account " + walletClient.account.address)


}
export async  function sendErc20(batchCallContractAddress :`0x${string}`,toAddress1: `0x${string}`,tokenAddress: `0x${string}`){
    const authorization = await walletClient.signAuthorization({
        batchCallContractAddress
    })
    const transferABiData =  encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
            toAddress1,5
        ]
    });
    const hash = await walletClient.writeContract({
        authorizationList: [authorization],
        abi: batchCallAbi,
        address:walletClient.account.address,
        functionName: 'execute',
        args: [[
            {
                // transfer - to - amount
                // transfer - 0x313Ce9CaCA7efaa381aC3DB923CC98bC02b87259 - 100 token
                data: transferABiData,
                // token address
                to: tokenAddress,
                value: parseEther('5')
            }
        ]]
    })
    console.log(hash);
}


