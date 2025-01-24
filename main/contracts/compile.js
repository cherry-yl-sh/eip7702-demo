
const solc = require('solc');
const fs = require('fs');

// Read Solidity contract code
const contractPath = './BatchCallDelegation.contracts';
const sourceCode = fs.readFileSync(contractPath, 'utf8');

// Set up the input for the compiler
const input = {
    language: 'Solidity',
    sources: {
        'BatchCallDelegation.sol': {
            content: sourceCode,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['evm.bytecode.object', 'abi'], // Output bytecode and ABI
            },
        },
    },
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Extract the bytecode and ABI
const bytecode = output.contracts['BatchCallDelegation.sol'].BatchCallDelegation.evm.bytecode.object;
const abi = output.contracts['BatchCallDelegation.sol'].BatchCallDelegation.abi;

console.log('Bytecode:', bytecode);
console.log('ABI:', JSON.stringify(abi));
