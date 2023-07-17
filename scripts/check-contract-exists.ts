/* Notes:
- By default, this will check for the HelloWorld contract at the address specified in the .env file.
- To check for a different contract, use the --address option.
*/

// Imports
import { program } from "commander";
import { ethers } from "ethers";
import fs from "fs";
import Joi from "joi";
import _ from "lodash";

// Local imports
import { config } from "#root/config";
import ethereum from "#root/src/ethereum";
import { createLogger } from "#root/lib/logging";

// Environment variables
import dotenv from 'dotenv';
import path from 'path';
let rootDir = __dirname.substring(0, __dirname.lastIndexOf('/'));
let envFile = path.join(rootDir, config.envFileName);
dotenv.config({ path: envFile });
const {
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
  .option("--address <address>", "Ethereum address.")
  .option(
    "--address-file <addressFile>",
    "Path to file containing contract address."
  );
program.parse();
const options = program.opts();
if (options.debug) console.log(options);
let { debug, logLevel, network: networkLabel, address, addressFile } = options;

// Process and validate arguments

ethereum.validateAddressesSync({
  addresses: {
    LOCAL_HARDHAT_DEPLOYED_CONTRACT_ADDRESS,
    SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS,
    ETHEREUM_MAINNET_DEPLOYED_CONTRACT_ADDRESS,
  },
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
ethereum.setLogLevel({ logLevel });

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

let contractAddress: string;
if ((address && addressFile) || (!address && !addressFile)) {
  console.error(
    "Exactly one of the arguments '--address' or '--address-file' must be provided."
  );
  program.help(); // Display help and exit
}
if (addressFile && !fs.existsSync(addressFile)) {
  var msg = `Address file not found: ${addressFile}`;
  console.error(msg);
  process.exit(1);
}

if (addressFile && fs.existsSync(addressFile)) {
  address = fs.readFileSync(addressFile).toString().trim();
  deb(`Address found in ${addressFile}: ${address}`);
}
if (!ethers.isAddress(address)) {
  var msg = `Invalid Ethereum address: ${address}`;
  console.error(msg);
  process.exit(1);
}
contractAddress = address;

// Setup

let provider: ethers.Provider;

var msg: string = "Unknown error";
let DEPLOYED_CONTRACT_ADDRESS: string | undefined;
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
// A supplied argument for the contract address overrides the shell environment variable.
if (!address) {
  if (!DEPLOYED_CONTRACT_ADDRESS) {
    logger.error(`No contract address supplied and no default address found.`);
    process.exit(1);
  }
  contractAddress = DEPLOYED_CONTRACT_ADDRESS;
}
if (!ethers.isAddress(contractAddress)) {
  logger.error(`Invalid contract address: ${contractAddress}`);
  process.exit(1);
}

// Run main function

main({contractAddress})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Functions

async function main({contractAddress}: {contractAddress: string}) {
  let blockNumber = await provider.getBlockNumber();
  deb(`Current block number: ${blockNumber}`);

  let address = contractAddress;

  let check = await ethereum.contractFoundAt({ provider, address });
  if (!check) {
    console.error(`No contract found at address: ${address}`);
    process.exit(1);
  }
  console.log(`Contract found at address: ${address}`);
}
