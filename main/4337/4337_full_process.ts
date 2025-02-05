import {createPublicClient, createWalletClient, http, parseEther, zeroAddress} from "viem";
import {localnode} from "../config";
import {privateKeyToAccount, privateKeyToAddress} from "viem/accounts";

import {eip7702Actions} from "viem/experimental";

import {sendUserOp} from "./4337_tools";

const myaccount = privateKeyToAccount(localnode.accountPk)



const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'

async function main(){
    const thisWalletClient = createWalletClient({
        account: myaccount,
        chain: localnode,
        transport: http(),
    }).extend(eip7702Actions())
    const pubClient = createPublicClient({
        chain: localnode,
        transport: http(),
    });
    sendUserOp(toAddress1,"http://localhost:4337" ,thisWalletClient,pubClient,false)
}

main();




