import {privateKeyToAccount} from "viem/accounts";
import {localnode, odyssey} from "../config";
import {createPublicClient, createWalletClient, http} from "viem";
import {eip7702Actions} from "viem/experimental";
import {createPimlicoClient} from "permissionless/clients/pimlico";
import {initSetUp, sendUserOp} from "./4337_tools";
const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'

const myaccount = privateKeyToAccount(odyssey.accountPk)
const walletClient = createWalletClient({
    account: myaccount,
    chain: odyssey,
    transport: http(),
}).extend(eip7702Actions())
const pubClient = createPublicClient({
    chain: odyssey,
    transport: http(),
});
async function main(){
    // initSetUp(walletClient)
    sendUserOp(toAddress1,"https://api.pimlico.io/v2/911867/rpc?apikey=pim_YKsBifRHXemLUB62XmDoGV",walletClient,pubClient,true)
}
main()