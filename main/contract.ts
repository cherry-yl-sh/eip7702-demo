export const abi = [
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

export const contractAddress = '0xC88f5ECABdEb026DE621A5A7f74c07ec409047f9'