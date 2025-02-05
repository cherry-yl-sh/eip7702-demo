import {createPimlicoClient} from "permissionless/clients/pimlico";
import {http, parseEther, zeroAddress} from "viem";
import {toSafeSmartAccount} from "permissionless/accounts";
import {privateKeyToAccount, privateKeyToAddress} from "viem/accounts";
import {localnode} from "../config";
import {createSmartAccountClient} from "permissionless";
import {safeAbiImplementation} from "./safeAbi";
import {ethers} from "ethers";
import {getSafeModuleSetupData} from "./setupData";
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
export async function sendUserOp(toAddress: `0x${string}`,pimlicoUrl:string,walletClient: any,pubClient:any,enablePaymser :  boolean ){
    console.log("Signing UserOperation with signer", walletClient.account.address);
    const pimlicoClient = createPimlicoClient({
        transport: http(pimlicoUrl),
    });
    const safeAccount = await toSafeSmartAccount({
        address: walletClient.account.address,
        owners: [privateKeyToAccount(localnode.safePrivateKey)],
        client: pubClient,
        version: "1.4.1",
    })
    const smartAccountClient = createSmartAccountClient({
        account: safeAccount,
        paymaster : enablePaymser ? pimlicoClient : undefined,
        bundlerTransport: http(pimlicoUrl),
        userOperation: {
            estimateFeesPerGas: async () => (await pimlicoClient.getUserOperationGasPrice()).fast,
        },
    })
    const userOperationHash = await smartAccountClient.sendUserOperation({
        calls: [
            {
                to: toAddress,
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

}
export async function initSetUp(walletClient: any){
    const authorization = await walletClient.signAuthorization({
        contractAddress: SAFE_SINGLETON_ADDRESS,
    })
    console.log(authorization)
    const txHash = await walletClient.writeContract({
        address: walletClient.address,
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