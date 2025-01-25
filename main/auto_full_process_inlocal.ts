import {privateKeyToAccount} from "viem/accounts";
import {localnode} from "./config";
import {createPublicClient, createWalletClient, formatEther, http} from "viem";
import {eip7702Actions} from "viem/experimental";
import {getBalance} from "viem/actions";
import {send7702Tx, send7702TxWithSponsor} from "./7702_basic_tool";

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
    const balance1 = await getBalance(pubClient, {   address: toAddress1,  })
    const balance1Ether = formatEther(balance1)

    console.log("balance1: " +  balance1Ether)

    // const txHash = await send7702Tx(walletClient,toAddress1,toAddress2, batchCallContractAddress)
    // console.log("tx Hash "+ txHash)
    // gettx 0xc02461c704975a2b76cd887dad138b85c8b8e2ed7457b101ea89a6585374cbfc
    // getrecepit 0xc02461c704975a2b76cd887dad138b85c8b8e2ed7457b101ea89a6585374cbfc
    // debug 0xc02461c704975a2b76cd887dad138b85c8b8e2ed7457b101ea89a6585374cbfc

    // send eth with sponsor
    const sponsor = privateKeyToAccount(localnode.sponsorPk)

    const sponsorTxHash = await send7702TxWithSponsor(walletClient,toAddress1,toAddress2, batchCallContractAddress,sponsor)

    console.log("sponsorTxHash "+ sponsorTxHash)

}
main()