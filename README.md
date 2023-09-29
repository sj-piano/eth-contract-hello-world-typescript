<a name="readme-top"></a>




<!-- PROJECT SHIELDS -->
<!--
*** We use markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Tela][tela-shield]][tela-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![AGPL V3 License][license-shield]][license-url]




<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sj-piano/ethereum-smart-contract-project-template-typescript">
    <img src="images/glider_600x480.png" alt="Logo" width="300" height="240">
  </a>
  <h3 align="center">A ready-for-production Ethereum smart contract project template</h3>
</div>




<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#project-status">Project Status</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#notes">Notes</a></li>
        <li><a href="#fee-limit-protections">Fee Limit Protections</a></li>
        <li><a href="#initial-setup">Initial Setup</a></li>
        <li><a href="#walkthrough-local">Walkthrough - Local Network</a></li>
        <li><a href="#walkthrough-testnet">Walkthrough - Sepolia Testnet</a></li>
        <li><a href="#walkthrough-mainnet">Walkthrough - Ethereum Mainnet</a></li>
        <li><a href="#contract-publication">Contract Publication</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>




<!-- ABOUT THE PROJECT -->
## About The Project

**Description:**

A ready-for-production Ethereum smart contract project template, written in Solidity and Typescript.

**Features:**
* Can estimate all fees before any actual transactions are sent
* Includes a complete Hardhat test suite
* Can deploy to a local Hardhat blockchain instance, Sepolia testnet, and Ethereum mainnet

**Licensing:**
* AGPL v3 software license
* Licensed for personal use
* Licensed for commercial use, if and only if all derivative source code is made public
* A private commercial software license is available for purchase - this removes the obligation for your company to publish any derived source code

**If you would like to:**
* ask a question
* report a bug
* ask for an addition to the README
* request a feature
* get a private commercial software license
* make a complaint
* hire me

Then [please contact me on Tela](https://www.tela.app/magic/stjohn_piano/ea344e). Thank you.

[![Tela][tela-shield]][tela-url]

If you would like to add me as a professional contact, you can [send me a connection request on LinkedIn](https://www.linkedin.com/in/stjohnpiano):

[![LinkedIn][linkedin-shield]][linkedin-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Project Status


The contract has been deployed to the Ethereum Mainnet at this address:  
`0xc2963E4f4C8456b21734c7c4811327A94324851E`

The contract is published here:  
[etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#code](https://etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#code)

You can read the contract's stored data at:  
[etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#readContract](https://etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#readContract)


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Built With


**Platforms & languages:**
- [Ethereum](https://ethereum.org/en) & [Solidity](https://soliditylang.org)
- [NodeJS](https://nodejs.org/en) & [Typescript](https://www.typescriptlang.org)

**Technologies & libraries:**
- Task management: [`task`](https://taskfile.dev/)
- NodeJS manager: [`nvm`](https://github.com/nvm-sh/nvm)
- Ethereum library: [`ethers`](https://docs.ethers.org/v6)
- Ethereum development environment: [`hardhat`](https://hardhat.org)
- Decimal arithmetic: [`big.ts`](https://mikemcl.github.io/big.ts)
- Test assertion: [`chai`](https://www.chaijs.com)
- Typescript formatter: [`prettier`](https://prettier.io)
- Typescript linter: [`eslint`](https://eslint.org)
- CLI interface: [`commander`](https://github.com/tj/commander.ts)
- Logging: [`winston`](https://github.com/winstonjs/winston)
- Data validation: [`joi`](https://github.com/hapijs/joi)
- JSON validation: [`ajv`](https://ajv.ts.org)

**Plugins:**
- [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier): Turns off all ESLint rules that have the potential to interfere with Prettier rules.
- [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier): Turns Prettier rules into ESLint rules.

Private keys are managed in a `user-config.env` file.


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- GETTING STARTED -->
## Getting Started

Follow these steps to get a local instance up and running.


### Prerequisites

Please create accounts and API keys at:
* [Etherscan](https://etherscan.io)
* [Infura](https://www.infura.io)

Please install:

* task: [guide](https://taskfile.dev/installation)
* nvm (Node Version Manager): [guide](https://github.com/nvm-sh/nvm#install--update-script)
* npm & NodeJS: [nvm-based guide](https://github.com/nvm-sh/nvm#usage)
* Metamask wallet (browser extension): [metamask.io](https://metamask.io)

Tested under these operating systems:
* Ubuntu 20.04.6 LTS (Focal Fossa) (Running on WSL 2 on Windows 10)

Tested with these versions:
* task: 3.27.0
* nvm: 0.35.3
* npm: 9.5.1
* NodeJS: 18.16.0

Notes:
* Use `nvm` to install `npm` and NodeJS.
* The Etherscan API key is used if you want to upload your contract to Etherscan when using [Hardhat verify](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify). Hardhat verify is included in Hardhat toolbox (a dependency of this project).


### Installation

Clone the repo:

```sh
git clone https://github.com/sj-piano/ethereum-smart-contract-project-template-typescript

mv ethereum-smart-contract-project-template-typescript contract-template
```

Install NPM packages:

```sh
cd contract-template && npm install
```

Copy the file `user-config.env.example` to `user-config.env` and fill it in with the relevant values.

**IMPORTANT: Pay particular attention to the settings in the top section: `FINANCIAL CONTROLS`**

Make sure that you are happy with these settings. If nothing else, be careful to at least double-check the `MAX_FEE_PER_TRANSACTION_USD` setting. This will govern how much you could potentially spend when you send a transaction to the Ethereum mainnet.

*Also important*: You need to supply the Infura API key *name*, not the secret.

Notes:

* When you run a local hardhat node, it will have some built-in private keys and addresses that hold some test Ethereum. In `user-config.env.example`, the `LOCAL_HARDHAT_PRIVATE_KEY` and `LOCAL_HARDHAT_ADDRESS` values hold the first of these keypairs.


<p align="right">(<a href="#readme-top">back to top</a>)</p>








## Usage




### Notes

`config.ts` stores the configuration used within the entire package. You probably won't need to look at it. Settings in the `user-config.env` file override it.

Most scripts accept a `network` argument, which specifies whether the script should connect to the local development blockchain (`local`), the Sepolia testnet (`testnet`), or the Ethereum mainnet (`mainnet`).

Most scripts have `--help` functionality. E.g. you can run:  
`npm run --silent ts-node scripts/get-network-fees.ts -- --help`

Most scripts can log at different levels of output. You can use `--log-level info` or `--debug` arguments.

See a list of examples that demonstrate how to use the various scripts:  
`task show-example-script-commands`


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Fee Limit Protections

The settings in the `user-config.env` file under the top section `FINANCIAL CONTROLS` impose strict limits on the maximum cost of a transaction.

The two "action" scripts, `hello-world-deploy.ts` and `hello-world-update-message.ts`, will both refuse to broadcast a transaction if these limits are exceeded. Additionally, the `hello-world-estimate-fees.ts` script will report that these limits will be exceeded.

You can of course change the limits in the `user-config.env` file if you wish, allowing a script to spend more money in order to broadcast the transaction.

Example output, after setting `MAX_FEE_PER_TRANSACTION_USD = "0.01"`:

```bash
stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-estimate-fees.ts

Contract deployment - estimated fee:
- baseFeeUsd limit exceeded: Base fee (0.95 USD) exceeds limit specified in config (0.01 USD). Current base fee is 498906.625 gwei (498906625000000 wei, 0.000498906625 ETH). Current ETH-USD exchange rate is 1908.57 USD.

Contract method call: 'update' - estimated fee:
- baseFeeUsd limit exceeded: Base fee (0.06 USD) exceeds limit specified in config (0.01 USD). Current base fee is 32019.75 gwei (32019750000000 wei, 0.00003201975 ETH). Current ETH-USD exchange rate is 1908.57 USD.

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/get-balance.ts -- --address-file input-data/local-hardhat-address.txt
9999.9987527334375 ETH (19077697.62 USD)

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-deploy.ts -- --log-level info
info:   Connecting to local network at http://localhost:8545...
info:   Estimated fee: 0.000005242106697840 ETH (0.01 USD)
- baseFeeUsd: Base fee (0.95 USD) exceeds limit specified in config (0.01 USD). Current base fee is 498906.625 gwei (498906625000000 wei, 0.000498906625 ETH). Current ETH-USD exchange rate is 1907.63 USD.

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-update-message.ts -- --input-file-json input-data/update-message-local-network.json
- baseFeeUsd: Base fee (0.06 USD) exceeds limit specified in config (0.01 USD). Current base fee is 32009.25 gwei (32009250000000 wei, 0.00003200925 ETH). Current ETH-USD exchange rate is 1907.72 USD.
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Initial Setup


See available commands:  

```sh
task --list

# You can also use: task -l
```

Run some initial tasks to check that everything is set up correctly.

```sh
task hello

task check-network-connections
```

Note: You should see this error `Could not connect to local network`, because we haven't started a Hardhat local network yet.

If `task check-network-connections` produces errors for connecting to testnet or mainnet, you can run the underlying script with the `--debug` flag:  
`npm run --silent ts-node scripts/check-network-connections.ts -- --debug`

Compile the contract and run the tests.

```sh
task compile-contracts

task test
```

Hardhat runs the tests on a temporary local blockchain.

We will start a more persistent local blockchain instance.

Open another terminal and run:  
`task start-local-node`

Leave the node running in this additional terminal. Log output will be displayed (the initial set of pre-loaded keypairs will be shown). Press Ctrl-C to stop the local node. Switch back to the original terminal and continue.

Check the fees on the various networks.

```sh
npm run --silent ts-node scripts/get-network-fees.ts

npm run --silent ts-node scripts/get-network-fees.ts -- --network=testnet

npm run --silent ts-node scripts/get-network-fees.ts -- --network=mainnet
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### <a id="walkthrough-local" />Walkthrough - Local Network


For demonstration purposes, we'll use reasonably high levels of logging during this local walkthrough.

We deploy the HelloWorld contract to the local blockchain (started with `task start-local-node`).

See the balance of the address that will deploy the contract:  
`npm run --silent ts-node scripts/get-balance.ts -- --address-file input-data/local-hardhat-address.txt`

See fee estimations for the different contract operations, including deployment:  
`npm run --silent ts-node scripts/hello-world-estimate-fees.ts`

Deploy the HelloWorld contract:  
`npm run --silent ts-node scripts/hello-world-deploy.ts -- --log-level info`

This will output an address. Copy this address into the `user-config.env` file as `LOCAL_HARDHAT_DEPLOYED_CONTRACT_ADDRESS`.

Confirm deployment:  
`npm run --silent ts-node scripts/check-contract-exists -- --debug`

Print the message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-get-message.ts -- --debug`

Create a new input file:  
`cp input-data/example-update-message.json input-data/update-message-local-network.json`

Open it and specify a new message e.g. `Hello Mars ! (local)`.

Update the message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-update-message.ts -- --input-file-json input-data/update-message-local-network.json --log-level info`

Print the new message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-get-message.ts`

Example output:

![](images/walkthrough_local_network.png)


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### <a id="walkthrough-testnet" />Walkthrough - Sepolia Testnet


You'll need some SepoliaETH for using the Sepolia Testnet. In your Metamask wallet, create a dedicated "Test" account. Switch to "Sepolia test network". Copy the address. Go to a Sepolia testnet faucet (e.g. this [PoW faucet](https://sepolia-faucet.pk910.de)) and get some SepoliaETH. Set the destination address to be your Metamask test address.

Create a new private key and store it in the `input-data` directory:  
`npm run --silent ts-node scripts/create-private-key.ts > input-data/sepolia-testnet-private-key.txt`

Display the private key:  
`cat input-data/sepolia-testnet-private-key.txt`

Store it in the `user-config.env` file as `SEPOLIA_TESTNET_PRIVATE_KEY`.

Derive an Ethereum address from the private key and store it in the `input-data` directory:  
`cat input-data/sepolia-testnet-private-key.txt | npm run --silent ts-node scripts/derive-address.ts > input-data/sepolia-testnet-address.txt`

Display the address:  
`cat input-data/sepolia-testnet-address.txt`

Store it in the `user-config.env` file as `SEPOLIA_TESTNET_ADDRESS`.

In Metamask, transfer a reasonable amount of SepoliaETH to this new address.

See the balance of the address that will deploy the contract:  
`npm run --silent ts-node scripts/get-balance.ts -- --network=testnet --address-file input-data/sepolia-testnet-address.txt`

See fee estimations for the different contract operations, including deployment:  
`npm run --silent ts-node scripts/hello-world-estimate-fees.ts -- --network=testnet`

Deploy the contract to the Sepolia testnet:  
`npm run --silent ts-node scripts/hello-world-deploy.ts -- --network=testnet`

This will output an address. Copy this address into the `user-config.env` file as `SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS`.

Confirm deployment:  
`npm run --silent ts-node scripts/check-contract-exists -- --network=testnet`

Print the message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=testnet`

Create a new input file:
`cp input-data/example-update-message.json input-data/update-message-sepolia-testnet.json`

Open it and specify a new message e.g. `Hello Mars ! (testnet)`.

Update the message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-update-message.ts -- --network=testnet --input-file-json input-data/update-message-sepolia-testnet.json`

Print the new message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=testnet`

Example output:

```bash
stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/get-balance.ts -- --network=testnet --address-file input-data/sepolia-testnet-address.txt
0.409023392670777583 ETH (780.81 USD)

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-estimate-fees.ts -- --network=testnet

Contract deployment - estimated fee:
- feeEth: 0.000000001001234324
- feeUsd: 0.00

No contract found at address 0x0000000000000000000000000000000000000000.

Contract method call: 'update' - estimated fee:
- feeEth: 0.000000000038147344
- feeUsd: 0.00

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-deploy.ts -- --network=testnet
0x02bCCb6Fa3e24b14566e571656EE53A7723884f7

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/check-contract-exists -- --network=testnet
Contract found at address: 0x02bCCb6Fa3e24b14566e571656EE53A7723884f7

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=testnet
Hello World!

stjohn@judgement:~/work/contract-template$ cp input-data/example-update-message.json input-data/update-message-sepolia-testnet.json

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-update-message.ts -- --network=testnet --input-file-json input-data/update-message-sepolia-testnet.json
The new message is:
Hello Mars ! (testnet)

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=testnet
Hello Mars ! (testnet)
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### <a id="walkthrough-mainnet" />Walkthrough - Ethereum Mainnet


If you wish to retrieve your SepoliaETH from the address created in the Sepolia testnet walkthrough (e.g. you want to transfer it back to your Metamask test account), you'll need to use a tool that can make the transfer (create, sign, broadcast, and track the transaction). Such a tool is not provided in this project.

Note that SepoliaETH is not worth anything, and it is reasonably straightforward to obtain more from a faucet.

However, actual Ethereum (ETH), used on the Ethereum mainnet, does have monetary value. Therefore, in this section, we recommend creating a new Metamask account (explicitly for test operations) and exporting its private key for use in this walkthrough. This means that afterwards there will be no need to make a retrieval transaction.

Note: If you know what you're doing, and you already have a capable transaction tool, you can create a new keypair, transfer some ETH to it, perform this walkthrough on the mainnet, and transfer any remaining ETH back to your original address.

So, let's begin.

We generally use the log level `info` here. This provides extra information that will help us understand what went wrong if a problem occurs.

In your Metamask wallet, create a dedicated "Test" account. Switch to "Ethereum Mainnet". We assume that you already have some Ethereum in Metamask or in another wallet tool. Transfer some ETH to this address. Copy the address.

Store it in the `user-config.env` file as `ETHEREUM_MAINNET_ADDRESS`.

Store it in the `input-data` directory in a new file called `ethereum-mainnet-address.txt`.

Now, export the corresponding private key from Metamask, using the following guide:

Metamask: [How to export an account's private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)

Store it in the `user-config.env` file as `ETHEREUM_MAINNET_PRIVATE_KEY`.

Store it in the `input-data` directory in a new file called `ethereum-mainnet-private-key.txt`.

See the balance of the address that will deploy the contract:  
`npm run --silent ts-node scripts/get-balance.ts -- --network=mainnet --log-level info --address-file input-data/ethereum-mainnet-address.txt`

See fee estimations for the different contract operations, including deployment:  
`npm run --silent ts-node scripts/hello-world-estimate-fees.ts -- --network=mainnet`

If a fee limit is exceeded, and you are willing to spend the money, increase the `MAX_FEE_PER_TRANSACTION_USD` value in `user-config.env`. Re-run the `hello-world-estimate-fees.ts` command above to confirm that no fee limit will be exceeded.

Deploy the contract to the Ethereum mainnet:  
`npm run --silent ts-node scripts/hello-world-deploy.ts -- --network=mainnet --log-level info`

This will output an address. Copy this address into the `user-config.env` file as `ETHEREUM_MAINNET_DEPLOYED_CONTRACT_ADDRESS`.

Confirm deployment:  
`npm run --silent ts-node scripts/check-contract-exists -- --network=mainnet --log-level info`

Print the message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=mainnet --log-level info`

Create a new input file:  
`cp input-data/example-update-message.json input-data/update-message-ethereum-mainnet.json`

Open it and specify a new message e.g. `Hello Mars ! (mainnet)`.

Update the message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-update-message.ts -- --network=mainnet --log-level info --input-file-json input-data/update-message-ethereum-mainnet.json`

Print the new message stored in the contract:  
`npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=mainnet --log-level info`

Example output:

```bash
stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/get-balance.ts -- --network=mainnet --log-level info --address-file input-data/ethereum-mainnet-address.txt
info:   Connecting to Ethereum mainnet...
info:   Getting balance for address 0x4A846013314b892Be429F8626487109DD7b494a0...
0.042281201108669793 ETH (80.73 USD)

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-estimate-fees.ts -- --network=mainnet

Contract deployment - estimated fee:
- baseFeeUsd limit exceeded: Base fee (17.47 USD) exceeds limit specified in config (5.00 USD). Current base fee is 9149184.714182905 gwei (9149184714182905 wei, 0.009149184714182905 ETH). Current ETH-USD exchange rate is 1909.52 USD.

No contract found at address 0x0000000000000000000000000000000000000000.

Contract method call: 'update' - estimated fee:
- feeEth: 0.00035021612752418
- feeUsd: 0.67

# Here, after seeing the estimated fees, I set the MAX_FEE_PER_TRANSACTION_USD value in user-config.env to "20.00".

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-estimate-fees.ts -- --network=mainnet

Contract deployment - estimated fee:
- feeEth: 0.009101423868100018
- feeUsd: 17.39

No contract found at address 0x0000000000000000000000000000000000000000.

Contract method call: 'update' - estimated fee:
- feeEth: 0.000346767124202408
- feeUsd: 0.66

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-deploy.ts -- --network=mainnet --log-level info
info:   Connecting to Ethereum mainnet...
info:   Estimated fee: 0.009271102473677687 ETH (17.71 USD)
info:   Signer balance: 0.042281201108669793 ETH (80.77 USD)
info:   Final fee: 0.009006010206038837 ETH (17.21 USD)
info:   Contract deployed to address:
0xc2963E4f4C8456b21734c7c4811327A94324851E

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/check-contract-exists -- --network=mainnet --log-level info
info:   Connecting to Ethereum mainnet...
Contract found at address: 0xc2963E4f4C8456b21734c7c4811327A94324851E
stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=mainnet --log-level info
info:   Connecting to Ethereum mainnet...
info:   Contract found at address: 0xc2963E4f4C8456b21734c7c4811327A94324851E
info:   Message stored in HelloWorld contract:
Hello World!

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-update-message.ts -- --network=mainnet --log-level info --input-file-json input-data/update-message-ethereum-mainnet.json
info:   Connecting to Ethereum mainnet...
info:   Contract found at address: 0xc2963E4f4C8456b21734c7c4811327A94324851E
info:   Message stored in HelloWorld contract: Hello World!
info:   Estimated fee: 0.000573907171238688 ETH (1.10 USD)
info:   Signer balance: 0.033275190902630956 ETH (63.53 USD)
info:   Updating the message...
info:   Final fee: 0.000581844011532384 ETH (1.11 USD)
The new message is:
Hello Mars ! (mainnet)

stjohn@judgement:~/work/contract-template$ npm run --silent ts-node scripts/hello-world-get-message.ts -- --network=mainnet --log-level info
info:   Connecting to Ethereum mainnet...
info:   Contract found at address: 0xc2963E4f4C8456b21734c7c4811327A94324851E
info:   Message stored in HelloWorld contract:
Hello Mars ! (mainnet)
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Contract Publication


We use [Hardhat verify](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify) to publish the smart contracts to Etherscan.

The basic command is:  
`npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"`

This will upload the contract to the testnet explorer at [sepolia.etherscan.io](https://sepolia.etherscan.io). To upload to the mainnet explorer at [etherscan.io](https://etherscan.io), use `--network mainnet`.


#### We publish the Sepolia Testnet instance of the contract

```bash
SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS="0x0FdEe0538a2092937c68A4954e3f5adDb7532fC1"
npx hardhat verify --network sepolia $SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS "Hello World!"
```

Example output:

```bash
stjohn@judgement:~/work/contract-template$ SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS="0x02bCCb6Fa3e24b14566e571656EE53A7723884f7"

stjohn@judgement:~/work/contract-template$ npx hardhat verify --network sepolia $SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS "Hello World!"
Successfully submitted source code for contract
contracts/HelloWorld.sol:HelloWorld at 0x02bCCb6Fa3e24b14566e571656EE53A7723884f7
for verification on the block explorer. Waiting for verification result...

Successfully verified contract HelloWorld on the block explorer.
https://sepolia.etherscan.io/address/0x02bCCb6Fa3e24b14566e571656EE53A7723884f7#code
```

Summary:

The contract has been deployed to the Sepolia Testnet at this address:  
`0x02bCCb6Fa3e24b14566e571656EE53A7723884f7`

The contract is published here:  
[sepolia.etherscan.io/address/0x02bCCb6Fa3e24b14566e571656EE53A7723884f7#code](https://sepolia.etherscan.io/address/0x02bCCb6Fa3e24b14566e571656EE53A7723884f7#code)

You can read the contract's stored data at:  
[sepolia.etherscan.io/address/0x02bCCb6Fa3e24b14566e571656EE53A7723884f7#readContract](https://sepolia.etherscan.io/address/0x02bCCb6Fa3e24b14566e571656EE53A7723884f7#readContract)


#### We publish the Ethereum Mainnet instance of the contract

```bash
ETHEREUM_MAIN_DEPLOYED_CONTRACT_ADDRESS="0xc2963E4f4C8456b21734c7c4811327A94324851E"
npx hardhat verify --network mainnet $ETHEREUM_MAIN_DEPLOYED_CONTRACT_ADDRESS "Hello World!"
```

Example output:

```bash
stjohn@judgement:~/work/contract-template$ ETHEREUM_MAIN_DEPLOYED_CONTRACT_ADDRESS="0xc2963E4f4C8456b21734c7c4811327A94324851E"

stjohn@judgement:~/work/contract-template$ npx hardhat verify --network mainnet $ETHEREUM_MAIN_DEPLOYED_CONTRACT_ADDRESS "Hello World!"
Successfully submitted source code for contract
contracts/HelloWorld.sol:HelloWorld at 0xc2963E4f4C8456b21734c7c4811327A94324851E
for verification on the block explorer. Waiting for verification result...

Successfully verified contract HelloWorld on the block explorer.
https://etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#code
```

Summary:

The contract has been deployed to the Ethereum Mainnet at this address:  
`0xc2963E4f4C8456b21734c7c4811327A94324851E`

The contract is published here:  
[etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#code](https://etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#code)

You can read the contract's stored data at:  
[etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#readContract](https://etherscan.io/address/0xc2963E4f4C8456b21734c7c4811327A94324851E#readContract)



<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Roadmap

This project is complete. No future features or fixes are planned.


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- CONTRIBUTING -->
## Contributing


If you have enjoyed this project or found it helpful, please give it a star!


Feel free to fork the project and use it for development. Please add an acknowledgement to this project in your README file.


Please note: Github issues & pull requests will not be read unless you contact me about them in Tela.

[![Tela][tela-shield]][tela-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- LICENSE -->
## License

Distributed under the GNU Affero General Public License (AGPL). See `LICENSE.txt` for more information.


<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Contact


Project Link:
[https://github.com/sj-piano/ethereum-smart-contract-project-template-typescript](https://github.com/sj-piano/ethereum-smart-contract-project-template-typescript)


**If you would like to:**
* ask a question
* report a bug
* ask for an addition to the README
* request a feature
* get a private commercial software license
* make a complaint
* hire me

Then [please contact me on Tela](https://www.tela.app/magic/stjohn_piano/ea344e). Thank you.

[![Tela][tela-shield]][tela-url]

If you would like to add me as a professional contact, you can [send me a connection request on LinkedIn](https://www.linkedin.com/in/stjohnpiano):

[![LinkedIn][linkedin-shield]][linkedin-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Acknowledgments

A list of helpful resources:

* Choose an Open Source License: [choosealicense.com](https://choosealicense.com)

* Badges: [shields.io](https://shields.io)

* [Hardhat configuration](https://hardhat.org/hardhat-runner/docs/config)

* How Hardhat runs a local Ethereum blockchain for testing and development: [Hardhat Network](https://hardhat.org/hardhat-network/docs/overview)

* README template by Othneil Drew: [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

* Sepolia testnet PoW faucet: https://sepolia-faucet.pk910.de

* Metamask: [How to export an account's private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)

* Publish and verify smart contracts: [Hardhat verify](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)

* Sepolia Testnet block explorer: [sepolia.etherscan.io](https://sepolia.etherscan.io)

* Ethereum Mainnet block explorer: [etherscan.io](https://etherscan.io)

* Typescript Linting advice from Khalil Stemmler:  
    * [How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript)
    * [How to use Prettier with ESLint and TypeScript in VSCode](https://khalilstemmler.com/blogs/tooling/prettier)


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/sj-piano/ethereum-smart-contract-project-template-typescript?style=for-the-badge&color=32cb56
[license-url]: https://github.com/sj-piano/ethereum-smart-contract-project-template-typescript/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-StJohn_Piano-blue.svg?style=for-the-badge&logo=linkedin
[linkedin-url]: https://linkedin.com/in/stjohnpiano
[tela-shield]: https://img.shields.io/badge/Tela-StJohn_Piano-blue?style=for-the-badge
[tela-url]: https://www.tela.app/magic/stjohn_piano/ea344e
