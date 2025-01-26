import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import {devnet5, localnode} from "./config";


// Load environment variables
dotenv.config();

// Load environment variables from .env file
const PRIVATE_KEY = localnode.accountPk;
const RPC_URL = localnode.rpcUrls.default.http[0];

// Check for missing environment variables
if (!PRIVATE_KEY || !RPC_URL) {
    throw new Error("Missing PRIVATE_KEY or RPC_URL in environment variables");
}

export async function deployDemoErc20Token(rpcUrl: string, privateKey: string) {
    // Set up a provider and signer
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`Deploying contract with wallet address: ${await wallet.getAddress()}`);

    // Read the Solidity contract and compile it
    const contractPath = path.resolve(__dirname, "../main/contracts/DemoErc20.sol");
    const sourceCode = fs.readFileSync(contractPath, "utf8");

    // Compile the contract using ethers' `Solc`
    const solc = require("solc");
    const input = {
        language: "Solidity",
        sources: {
            "DemoErc20.sol": { content: sourceCode },
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["evm.bytecode.object", "abi"],
                },
            },
        },
    };
    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    const contractName = "DemoErc20";
    const bytecode = compiled.contracts["DemoErc20.sol"][contractName].evm.bytecode.object;
    const abi = compiled.contracts["DemoErc20.sol"][contractName].abi;

    // Deploy the contract
    console.log("Deploying contract...");
    console.log("ABI:", abi);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy("DEMO TOKEN","DEMO");
    await  contract.waitForDeployment()

    console.log(`Contract deployed at address: ${contract.target}`);
    return contract.target
}

// deployDemoErc20Token(RPC_URL, PRIVATE_KEY).catch((error) => {
//     console.error(error);
// });