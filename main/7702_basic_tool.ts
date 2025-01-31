import {createWalletClient, encodeFunctionData, http, parseEther} from 'viem'
import {privateKeyToAccount} from "viem/accounts";
import {eip7702Actions} from "viem/experimental";
import {batchCallAbi, erc20Abi} from "./contract"
import {devnet5, localnode} from "./config";
import type {PrivateKeyAccount} from "viem/accounts/types";
import {Addressable} from "ethers";




export async function send7702Tx(walletClient :any,toAddress1 :`0x${string}`,toAddress2 :`0x${string}`,contractAddress :`0x${string}` ) {
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

export async function send7702TxWithSponsor(walletClient :any,toAddress1 :`0x${string}`,toAddress2 :`0x${string}`,contractAddress :`0x${string}`,sponsorpk :`0x${string}`) {
    const sponsor = privateKeyToAccount(sponsorpk)

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

export async function sendErc20(walletClient :any,toAddress1: `0x${string}`,tokenAddress: `0x${string}`,tokenAmount :number,contractAddress :`0x${string}`){


    const authorization = await walletClient.signAuthorization({
      contractAddress:  contractAddress
    })

    console.log("auth: ",authorization)
    const transferABiData =  encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
            toAddress1,tokenAmount
        ]
    });
    console.log("transferABiData: ",transferABiData)
    const hash = await walletClient.writeContract({
        authorizationList: [authorization],
        abi: batchCallAbi,
        address: walletClient.account.address,
        functionName: 'execute',
        args: [[
            {
                data: '0x',
                to: '0x313Ce9CaCA7efaa381aC3DB923CC98bC02b87259',
                value: parseEther('0.001'),
            },
            {
                // transfer - to - amount
                // transfer - toAddress1 - 100 token
                data: transferABiData,
                // token address
                to: tokenAddress,
                value: parseEther('0')
            }
        ]]
    })
    console.log(hash);
    return hash ;
}


export async  function sendErc20WithSponsor(walletClient :any,toAddress1: `0x${string}`,tokenAddress: `0x${string}`,tokenAmount :number,contractAddress :`0x${string}`,sponsorpk :`0x${string}`){
    const sponsor = privateKeyToAccount(sponsorpk)

    const authorization = await walletClient.signAuthorization({
        contractAddress,
        sponsor
    })

    console.log("auth: ",authorization)
    const transferABiData =  encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
            toAddress1,tokenAmount
        ]
    });
    console.log("transferABiData: ",transferABiData)
    const hash = await walletClient.writeContract({
        account : sponsor,
        authorizationList: [authorization],
        abi: batchCallAbi,
        address:walletClient.account.address,
        functionName: 'execute',
        args: [[
            {
                // transfer - to - amount
                // transfer - toAddress1 - 100 token
                data: transferABiData,
                // token address
                to: tokenAddress,
                value: parseEther('0')
            }
        ]]
    })
    console.log(hash);
    return hash ;
}




