import {privateKeyToAccount} from "viem/accounts";
import {createPublicClient, createWalletClient, encodeFunctionData, formatEther, http, parseEther} from "viem";
import {devnet5} from "./config";
import {eip7702Actions} from "viem/experimental";
import {send7702Tx} from "./7702_basic_tool";
import {getBalance, getChainId, getTransaction} from "viem/actions";
import {batchCallAbi} from "./contract";

export const account = privateKeyToAccount(devnet5.accountPk)

 const walletClient = createWalletClient({
    account,
    chain: devnet5,
    transport: http(),
}).extend(eip7702Actions())

 const pubClient = createPublicClient({
    chain: devnet5,
    transport: http(),
});


async function main() {
    const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'
    //0xcb98643b8786950f0461f3b0edf99d88f274574d
    const balance1 = await getBalance(pubClient, {   address: toAddress1,  })
    const balance1Ether = formatEther(balance1)

    console.log("balance1: " +  balance1Ether)

    const txHash = await send7702Tx(walletClient,toAddress1)
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
    const data =  encodeFunctionData({
        abi: batchCallAbi,
        functionName: 'execute',
        args: [
            [
                {
                    data: '0x',
                    to: '0xcb98643b8786950F0461f3B0edf99D88F274574D',
                    value: parseEther('0.001'),
                },
                {
                    data: '0x',
                    to: '0xcb98643b8786950F0461f3B0edf99D88F274574D',
                    value: parseEther('0.001'),
                },
            ],
        ]
    });
    console.log("data :"+  data);
}

main()