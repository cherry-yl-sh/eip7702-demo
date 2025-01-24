import {privateKeyToAccount} from "viem/accounts";
import {createPublicClient, createWalletClient, formatEther, http} from "viem";
import {devnet5} from "./config";
import {eip7702Actions} from "viem/experimental";
import {send7702Tx} from "./1_setContract";
import {getBalance, getChainId, getTransaction} from "viem/actions";

export const account = privateKeyToAccount(devnet5.accountPk)

export const walletClient = createWalletClient({
    account,
    chain: devnet5,
    transport: http(),
}).extend(eip7702Actions())

export const pubClient = createPublicClient({
    chain: devnet5,
    transport: http(),
});

async function main() {
    const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'
    const toAddress2 = '0xd2135CfB216b74109775236E36d4b433F1DF507B'

    const balance1 = await getBalance(pubClient, {   address: toAddress1,  })
    const balance1Ether = formatEther(balance1)
    const balance2 = await getBalance(pubClient, {   address: toAddress2,    })
    const balance2Ether = formatEther(balance2)
    console.log("balance1: " +  balance1Ether)
    console.log("balance2: " + balance2Ether)

    const txHash = await send7702Tx(toAddress1, toAddress2)
    console.log("tx Hash "+ txHash)
    // const balance1After = await getBalance(pubClient, {   address: toAddress1, })
    // const balance1AfterEther = formatEther(balance1After)
    // const balance2After = await getBalance(pubClient, {   address: toAddress2,   })
    // const balance2AfterEther = formatEther(balance2After)
    // console.log("balance1After: " + balance1AfterEther)
    // console.log("balance2After: " + balance2AfterEther)
    //
}

async  function  info(){
    const balance1After = await getBalance(pubClient, {   address: '0xcb98643b8786950F0461f3B0edf99D88F274574D'})
    const balance1AfterEther = formatEther(balance1After)
    console.log("balance1After: " + balance1AfterEther)
}
info()