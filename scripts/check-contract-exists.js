/* Notes:
- By default, this will check for the HelloWorld contract at the address specified in the .env file.
- To check for a different contract, use the --address option.
*/

// Imports
const { program } = require("commander");
const { ethers } = require("ethers");
const fs = require("fs");
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
  )
  .option(
    "--address-file <addressFile>",
    "Path to file containing contract address."
  );
program.parse();
const options = program.opts();
if (options.debug) console.log(options);
let { debug, logLevel, network: networkLabel, addressFile } = options;

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

let contractAddress;
if (fs.existsSync(addressFile)) {
  let contractAddress = fs.readFileSync(addressFile).toString().trim();
  deb(`Address found in ${addressFile}: ${contractAddress}`);
}

// Setup

let provider;

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
// Supplied contract file takes precedence over shell environment variable.
if (contractAddress) {
  DEPLOYED_CONTRACT_ADDRESS = contractAddress;
}
if (!ethers.isAddress(DEPLOYED_CONTRACT_ADDRESS)) {
  logger.error(`Invalid contract address: ${DEPLOYED_CONTRACT_ADDRESS}`);
  process.exit(1);
}

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

  let address = DEPLOYED_CONTRACT_ADDRESS;

  let check = await ethereum.contractFoundAt({ logger, provider, address });
  if (!check) {
    logger.error(`No contract found at address: ${address}`);
    process.exit(1);
  }
  console.log(`Contract found at address: ${address}`);
}
