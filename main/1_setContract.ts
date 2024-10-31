import {createWalletClient, http, parseEther} from 'viem'
import {privateKeyToAccount} from "viem/accounts";
import {eip7702Actions} from "viem/experimental";
import {contractAddress, abi} from "./contract"
import {devnet4} from "./config";


// 0x3e918Eb72702C3370CcdF6E1d13d68ADB3CC0123
export const account = privateKeyToAccount('0x...')

export const walletClient = createWalletClient({
    account,
    chain: devnet4,
    transport: http(),
}).extend(eip7702Actions())


async function initalSetContract() {
    // 1. Sign Authorization
    const authorization = await walletClient.signAuthorization({
        contractAddress
    })

    console.log(authorization)

    // 2. Invoke the Contract's `execute` function to perform batch calls.
    const hash = await walletClient.writeContract({
        abi,
        address: walletClient.account.address,
        functionName: 'execute',
        args: [[
            {
                data: '0x',
                to: '0xcb98643b8786950F0461f3B0edf99D88F274574D',
                value: parseEther('0.0001'),
            }
        ]],
        authorizationList: [authorization],
    })

    console.log(hash);
}


initalSetContract()



