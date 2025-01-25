export const batchCallAbi = [
    {
        "type": "function",
        "name": "execute",
        "inputs": [
            {
                "name": "calls",
                "type": "tuple[]",
                "components": [
                    {
                        "name": "data",
                        "type": "bytes",
                    },
                    {
                        "name": "to",
                        "type": "address",
                    },
                    {
                        "name": "value",
                        "type": "uint256",
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
] as const

export const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'