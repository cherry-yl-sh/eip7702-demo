import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import {devnet5} from "./config";


// Load environment variables
dotenv.config();

// Load environment variables from .env file
const PRIVATE_KEY = devnet5.accountPk;
const RPC_URL = devnet5.rpcUrls.default.http[0];

// Check for missing environment variables
if (!PRIVATE_KEY || !RPC_URL) {
    throw new Error("Missing PRIVATE_KEY or RPC_URL in environment variables");
}

async function main() {
    // Set up a provider and signer
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log(`Deploying contract with wallet address: ${await wallet.getAddress()}`);

    // Read the Solidity contract and compile it
    const contractPath = path.resolve(__dirname, "../main/contracts/BatchCallDelegation.sol");
    const sourceCode = fs.readFileSync(contractPath, "utf8");

    // Compile the contract using ethers' `Solc`
    const solc = require("solc");
    const input = {
        language: "Solidity",
        sources: {
            "BatchCallDelegation.sol": { content: sourceCode },
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
    const contractName = "BatchCallDelegation";
    const bytecode = compiled.contracts["BatchCallDelegation.sol"][contractName].evm.bytecode.object;
    const abi = compiled.contracts["BatchCallDelegation.sol"][contractName].abi;

    // Deploy the contract
    console.log("Deploying contract...");
    console.log("ABI:", abi);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    await  contract.waitForDeployment()

    console.log(`Contract deployed at address: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
