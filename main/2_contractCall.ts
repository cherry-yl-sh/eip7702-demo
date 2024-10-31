import {createWalletClient, http, parseEther} from 'viem'
import {privateKeyToAccount} from "viem/accounts";
import {abi} from "./contract"
import {devnet4} from "./config";


// 0x90464A8880FC0f91e889043cA1e4535D2Dc78888
export const account = privateKeyToAccount('0x...')

export const walletClient = createWalletClient({
    account,
    chain: devnet4,
    transport: http(),
})

async function execute() {
    const hash = await walletClient.writeContract({
        abi,
        address: '0x3e918Eb72702C3370CcdF6E1d13d68ADB3CC0123',
        functionName: 'execute',
        args: [[
            {
                data: '0x',
                to: '0x313Ce9CaCA7efaa381aC3DB923CC98bC02b87259',
                value: parseEther('0.001'),
            },
            {
                // transfer - to - amount
                // transfer - 0x313Ce9CaCA7efaa381aC3DB923CC98bC02b87259 - 100 token
                data: '0xa9059cbb000000000000000000000000313ce9caca7efaa381ac3db923cc98bc02b872590000000000000000000000000000000000000000000000056bc75e2d63100000',
                // token address
                to: '0x2B577657B3a8012111075AEf0a067bB136b83ea8',
                value: parseEther('0')
            }
        ]]
    })

    console.log(hash);
}

execute()



