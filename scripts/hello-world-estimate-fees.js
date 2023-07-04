// Imports
const { program } = require("commander");
const { ethers } = require("ethers");
const Joi = require("joi");
const _ = require("lodash");

// Local imports
const { config } = require("#root/config.js");
const ethereum = require("#root/src/ethereum.js");
const { createLogger } = require("#root/lib/logging.js");

// Load environment variables
require("dotenv").config();
const {
  MAX_FEE_PER_TRANSACTION_USD,
  MAX_FEE_PER_GAS_GWEI,
  MAX_PRIORITY_FEE_PER_GAS_GWEI,
  INFURA_API_KEY_NAME,
  LOCAL_HARDHAT_DEPLOYED_CONTRACT_ADDRESS,
  SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS,
  ETHEREUM_MAINNET_DEPLOYED_CONTRACT_ADDRESS,
} = process.env;

// Logging
const { logger, log, deb } = createLogger();

// Parse arguments
program
  .option("-d, --debug", "log debug information")
  .option("--log-level <logLevel>", "Specify log level.", "error")
  .option(
    "--network <network>",
    "specify the Ethereum network to connect to",
    "local"
  );
program.parse();
const options = program.opts();
if (options.debug) console.log(options);
let { debug, logLevel, network: networkLabel } = options;

// Process and validate arguments

ethereum.validateAddressesSync({
  addresses: {
    LOCAL_HARDHAT_DEPLOYED_CONTRACT_ADDRESS,
    SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS,
    ETHEREUM_MAINNET_DEPLOYED_CONTRACT_ADDRESS,
  },
});

config.update({
  MAX_FEE_PER_TRANSACTION_USD,
  MAX_FEE_PER_GAS_GWEI,
  MAX_PRIORITY_FEE_PER_GAS_GWEI,
});

const logLevelSchema = Joi.string().valid(...config.logLevelList);
let logLevelResult = logLevelSchema.validate(logLevel);
if (logLevelResult.error) {
  var msg = `Invalid log level "${logLevel}". Valid options are: [${config.logLevelList.join(
    ", "
  )}]`;
  console.error(msg);
  process.exit(1);
}
if (debug) {
  logLevel = "debug";
}
logger.setLevel({ logLevel });

const networkLabelSchema = Joi.string().valid(...config.networkLabelList);
let networkLabelResult = networkLabelSchema.validate(networkLabel);
if (networkLabelResult.error) {
  var msg = `Invalid network "${networkLabel}". Valid options are: [${config.networkLabelList.join(
    ", "
  )}]`;
  console.error(msg);
  process.exit(1);
}
const network = config.mapNetworkLabelToNetwork[networkLabel];

// Setup

const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

let provider, signer;

var msg;
if (networkLabel == "local") {
  msg = `Connecting to local network at ${network}...`;
  provider = new ethers.JsonRpcProvider(network);
  DEPLOYED_CONTRACT_ADDRESS = LOCAL_HARDHAT_DEPLOYED_CONTRACT_ADDRESS;
} else if (networkLabel == "testnet") {
  msg = `Connecting to Sepolia testnet...`;
  provider = new ethers.InfuraProvider(network, INFURA_API_KEY_NAME);
  DEPLOYED_CONTRACT_ADDRESS = SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS;
} else if (networkLabel == "mainnet") {
  msg = `Connecting to Ethereum mainnet...`;
  provider = new ethers.InfuraProvider(network, INFURA_API_KEY_NAME);
  DEPLOYED_CONTRACT_ADDRESS = ETHEREUM_MAINNET_DEPLOYED_CONTRACT_ADDRESS;
}
log(msg);
const contractFactoryHelloWorld = new ethers.ContractFactory(
  contract.abi,
  contract.bytecode,
  provider
);
if (!ethers.isAddress(DEPLOYED_CONTRACT_ADDRESS)) {
  log(`Invalid contract address: ${DEPLOYED_CONTRACT_ADDRESS}`);
  log(`Switching to a dummy address: ${config.dummyAddress}`);
  DEPLOYED_CONTRACT_ADDRESS = config.dummyAddress;
}
const contractHelloWorld = new ethers.Contract(
  DEPLOYED_CONTRACT_ADDRESS,
  contract.abi,
  signer
);

// Run main function

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Functions

async function main() {
  let blockNumber = await provider.getBlockNumber();
  deb(`Current block number: ${blockNumber}`);

  // Contract deployment
  const initialMessage = "Hello World!";
  const txRequest = await contractFactoryHelloWorld.getDeployTransaction(
    initialMessage
  );
  const estimatedFees = await ethereum.estimateFees({
    config,
    logger,
    provider,
    txRequest,
  });
  console.log(`\nContract deployment - estimated fee:`);
  log(estimatedFees);
  if (!estimatedFees.feeLimitChecks.anyLimitExceeded) {
    console.log(`- feeEth: ${estimatedFees.feeEth}`);
    console.log(`- feeUsd: ${estimatedFees.feeUsd}`);
  } else {
    for (let key of estimatedFees.feeLimitChecks.limitExceededKeys) {
      let check = estimatedFees.feeLimitChecks[key];
      console.log(`- ${key} limit exceeded: ${check.msg}`);
    }
  }

  // Check if contract exists at address
  let address = contractHelloWorld.target;
  let check = await ethereum.contractFoundAt({ logger, provider, address });
  if (!check) {
    console.log(`\nNo contract found at address ${address}.`);
  }
  log(`\nContract found at address: ${address}`);

  // Contract method call: update
  const newMessage = "Hello World! Updated.";
  const txRequest2 = await contractHelloWorld.update.populateTransaction(
    newMessage
  );
  const estimatedFees2 = await ethereum.estimateFees({
    config,
    logger,
    provider,
    txRequest: txRequest2,
  });
  console.log(`\nContract method call: 'update' - estimated fee:`);
  log(estimatedFees2);
  if (!estimatedFees2.feeLimitChecks.anyLimitExceeded) {
    console.log(`- feeEth: ${estimatedFees2.feeEth}`);
    console.log(`- feeUsd: ${estimatedFees2.feeUsd}`);
  } else {
    for (let key of estimatedFees2.feeLimitChecks.limitExceededKeys) {
      let check = estimatedFees2.feeLimitChecks[key];
      console.log(`- ${key} limit exceeded: ${check.msg}`);
    }
  }

  console.log();
}
