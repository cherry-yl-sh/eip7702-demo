import {privateKeyToAccount} from "viem/accounts";
import {createPublicClient, createWalletClient, encodeFunctionData, formatEther, http, parseEther} from "viem";
import {devnet5, localnode, odyssey} from "./config";
import {eip7702Actions} from "viem/experimental";
import {send7702Tx, send7702TxWithSponsor, sendErc20} from "./7702_basic_tool";
import {getBalance, getChainId, getTransaction} from "viem/actions";
import {batchCallAbi} from "./contract";

export const account = privateKeyToAccount(odyssey.accountPk)




async function main() {
    const batchCallContractAddress = "0xadeEbe459E44222eD40Fa615bE9a929D2FA77893"
    const walletClient = createWalletClient({
        account,
        chain: odyssey,
        transport: http(),
    }).extend(eip7702Actions())
    sendErc20(walletClient,"0xcb98643b8786950F0461f3B0edf99D88F274574D","0x706Aa5C8e5cC2c67Da21ee220718f6f6B154E75c",5,batchCallContractAddress)

}


main()