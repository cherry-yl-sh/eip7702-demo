import {createWalletClient, encodeFunctionData, http, parseEther} from 'viem'
import {privateKeyToAccount} from "viem/accounts";
import {eip7702Actions} from "viem/experimental";
import {contractAddress, abi} from "./contract"
import {devnet5} from "./config";


export const account = privateKeyToAccount(devnet5.accountPk)

export const walletClient = createWalletClient({
    account,
    chain: devnet5,
    transport: http(),
}).extend(eip7702Actions())

export async  function sendTxWithSponsor(){

}

export async function send7702Tx(toAddress1 :`0x${string}` , toAddress2 :`0x${string}`) {
    // 1. Sign Authorization
    const authorization = await walletClient.signAuthorization({
        contractAddress
    })

    console.log(authorization)

   // 2. Invoke the Contract's `execute` function to perform batch calls.
    const hash = await walletClient.sendTransaction({
        authorizationList: [authorization],
        data: encodeFunctionData({
            abi,
            functionName: 'execute',
            args: [
                [
                    {
                        data: '0x',
                        to: toAddress1,
                        value: parseEther('0.001'),
                    },
                    {
                        data: '0x',
                        to: toAddress2,
                        value: parseEther('0.001'),
                    },
                ],
            ]
        }),
        to: walletClient.account.address,
    })
    console.log(hash);
    return hash;
}




