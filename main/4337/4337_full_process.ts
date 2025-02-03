import {createPublicClient, createWalletClient, http, parseEther, zeroAddress} from "viem";
import {localnode} from "../config";
import {privateKeyToAccount, privateKeyToAddress} from "viem/accounts";
import {createPimlicoClient} from "permissionless/clients/pimlico";
import {createBundlerClient, entryPoint06Address,} from "viem/account-abstraction";
import {eip7702Actions} from "viem/experimental";
import {ethers} from "ethers";
import {createSmartAccountClient} from "permissionless";
import {toLightSmartAccount, toSafeSmartAccount} from "permissionless/accounts";
import {getSafeModuleSetupData} from "./setupData";
import {safeAbiImplementation} from "./safeAbi";

const myaccount = privateKeyToAccount(localnode.accountPk)

const walletClient = createWalletClient({
    account: myaccount,
    chain: localnode,
    transport: http(),
}).extend(eip7702Actions())
const pubClient = createPublicClient({
    chain: localnode,
    transport: http(),
});

const pimlicoUrl = "http://localhost:4337"
export const bundlerClient = createBundlerClient({
    client: pubClient,
    transport: http("http://localhost:4337"),
});
const pimlicoClient = createPimlicoClient({
    transport: http(pimlicoUrl),
});

const provider = new ethers.JsonRpcProvider(localnode.rpcUrls.default.http[0]);

const SAFE_SINGLETON_ADDRESS = "0x41675C099F32341bf84BFc5382aF534df5C7461a"
const SAFE_MULTISEND_ADDRESS = "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526"
const SAFE_4337_MODULE_ADDRESS = "0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226"

// Parameters for Safe's setup call.
const owners = [privateKeyToAddress(localnode.safePrivateKey)]
const signerThreshold = 1n
const setupAddress = SAFE_MULTISEND_ADDRESS
const setupData = getSafeModuleSetupData()
const fallbackHandler = SAFE_4337_MODULE_ADDRESS
const paymentToken = zeroAddress
const paymentValue = 0n
const paymentReceiver = zeroAddress
const toAddress1 = '0xcb98643b8786950F0461f3B0edf99D88F274574D'

async function main(){
    console.log("Signing UserOperation with signer", myaccount.address);

    const safeAccount = await toSafeSmartAccount({
        address: myaccount.address,
        owners: [privateKeyToAccount(localnode.safePrivateKey)],
        client: pubClient,
        version: "1.4.1",
    })
    const smartAccountClient = createSmartAccountClient({
        account: safeAccount,
        bundlerTransport: http(pimlicoUrl),
        userOperation: {
            estimateFeesPerGas: async () => (await pimlicoClient.getUserOperationGasPrice()).fast,
        },
    })
    const userOperationHash = await smartAccountClient.sendUserOperation({
        calls: [
            {
                to: toAddress1,
                value: parseEther('0.001'),
                data: "0x",
            },
        ],
    })

    const { receipt } = await smartAccountClient.waitForUserOperationReceipt({
        hash: userOperationHash,
    })
    const bigIntReplacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
            return value.toString(); // Convert BigInt to string
        }
        return value; // Return other values unchanged
    };
    console.log("UserOperation included:" + JSON.stringify(receipt, bigIntReplacer))
    printAllTxInf(receipt.transactionHash)

}
async function initSetUp(){
    const authorization = await walletClient.signAuthorization({
        contractAddress: SAFE_SINGLETON_ADDRESS,
    })
    console.log(authorization)
    const txHash = await walletClient.writeContract({
        address: myaccount.address,
        abi: safeAbiImplementation,
        functionName: "setup",
        args: [
            owners,
            signerThreshold,
            setupAddress,
            setupData,
            fallbackHandler,
            paymentToken,
            paymentValue,
            paymentReceiver,
        ],
        authorizationList: [authorization],
    })
    console.log(txHash)
}
main();
async function printAllTxInf(txHash: `0x${string}`) {

    const bigIntReplacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
            return value.toString(); // Convert BigInt to string
        }
        return value; // Return other values unchanged
    };// getTx
    const txInfo = await pubClient.getTransaction({hash: txHash})
    console.log("txInfo: " + JSON.stringify(txInfo, bigIntReplacer));

    const txReceipt = await pubClient.getTransactionReceipt({hash: txHash})
    console.log("txReceipt: " + JSON.stringify(txReceipt, bigIntReplacer))

    const trace = await pubClient.request({
        method: "debug_traceTransaction" as any,
        params: [
            txHash, // Transaction hash to trace
            {tracer: "callTracer"} as any, // Tracer configuration
        ],

    });

    console.log("debugInfo: " + JSON.stringify(trace, bigIntReplacer))
}



