# poc-eip7702

use 7702 send tx 

1. run a ethereum node in pergue vuersion 
```shell
curl -L https://foundry.paradigm.xyz | bash
anvil --hardfork prague
```

you will see
![img_1.png](img_1.png)
2. run a bundler with entrypoint v6
```shell
git clone https://github.com/pimlicolabs/alto
cd alto
pnpm install
ts-node script/localDeveloper/index.ts
./alto --config scripts/config.local.json
```
you will see
![img.png](img.png)

A POC for using unSafe contracts with EIP-7702

```bash
git clone https://github.com/safe-global/safe-smart-account.git

```
https://pectra-devnet-5.ethpandaops.io/



----
combine 7702 with 4337

