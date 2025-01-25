import {createWalletClient, encodeFunctionData, http, parseEther} from 'viem'
import {privateKeyToAccount} from "viem/accounts";
import {eip7702Actions} from "viem/experimental";
import { batchCallAbi} from "./contract"
import {devnet5} from "./config";
import type {PrivateKeyAccount} from "viem/accounts/types";




export async function send7702Tx(walletClient :any,toAddress1 :`0x${string}`,toAddress2 :`0x${string}`,contractAddress :`0x${string}`) {
    // 1. Sign Authorization
    const authorization = await walletClient.signAuthorization({
        contractAddress
    })

    console.log(authorization)

   // 2. Invoke the Contract's `execute` function to perform batch calls.
    const hash = await walletClient.sendTransaction({
        authorizationList: [authorization],
        data: encodeFunctionData({
            abi: batchCallAbi,
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
                    }
                ],
            ]
        }),
        to: walletClient.account.address,
    })
    console.log(hash);
    return hash;
}

export async function send7702TxWithSponsor(walletClient :any,toAddress1 :`0x${string}`,toAddress2 :`0x${string}`,contractAddress :`0x${string}`,sponsor :PrivateKeyAccount) {
    // 1. Sign Authorization
    const authorization = await walletClient.signAuthorization({
        contractAddress,
        sponsor
    })

    console.log(authorization)

    // 2. Invoke the Contract's `execute` function to perform batch calls.
    const hash = await walletClient.sendTransaction({
        account: sponsor,
        authorizationList: [authorization],
        data: encodeFunctionData({
            abi: batchCallAbi,
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
                    }
                ],
            ]
        }),
        to: walletClient.account.address,
    })
    console.log(hash);
    return hash;
}



