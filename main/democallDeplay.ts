import * as fs from "fs";
import {ethers} from "ethers";
import {localnode} from "./config";
import path from "path";

// Read Solidity code from file
const PRIVATE_KEY = localnode.accountPk;
const RPC_URL = localnode.rpcUrls.default.http[0];

async function deploy() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contractPath = path.resolve(__dirname, "../main/contracts/DemoErc20.sol");

    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
        language: "Solidity",
        sources: {
            "DemoErc20.sol": {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode"],
                },
            },
        },
    };
    const solc = require("solc");
    const compiled = solc.compile(JSON.stringify(input));
    const output = JSON.parse(compiled);

// Extract ABI and Bytecode
    const abi = output.contracts["DemoErc20.sol"]["DemoErc20"].abi;
    const bytecode = output.contracts["DemoErc20.sol"]["DemoErc20"].evm.bytecode.object;

    console.log(abi);
    console.log(bytecode);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy the contract with the constructor parameters
    const contract = await factory.deploy("Demo Token", "DMT");

    // Wait for deployment transaction to be mined
    await  contract.waitForDeployment()

    console.log(`Contract deployed at address: ${contract.target}`);
}

deploy().catch((error) => {
    console.error(error);
});