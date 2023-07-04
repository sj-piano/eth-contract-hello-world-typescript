// Imports
const { program } = require("commander");
const { ethers } = require("ethers");
const Joi = require("joi");
const _ = require("lodash");

// Local imports
const { config } = require("#root/config.js");
const { createLogger } = require("#root/lib/logging.js");

// Load environment variables
require("dotenv").config();
const { INFURA_API_KEY_NAME } = process.env;

// Logging
const { logger, log, deb } = createLogger();

// Parse arguments
program
  .option("-d, --debug", "log debug information")
  .option("--log-level <logLevel>", "Specify log level.", "error");
program.parse();
const options = program.opts();
if (options.debug) console.log(options);
let { debug, logLevel } = options;

// Process and validate arguments

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

// Run main function

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Main function

async function main() {
  let connections = {
    local: {
      description: "local hardhat node",
      connected: false,
    },
    testnet: {
      description: "Sepolia testnet",
      connected: false,
    },
    mainnet: {
      description: "Ethereum mainnet",
      connected: false,
    },
  };

  // Check local network connection
  let networkLabel = "local";
  let network = config.mapNetworkLabelToNetwork[networkLabel];
  let msg = `Connecting to ${networkLabel} network at ${network}...`;
  log(msg);
  let provider = new ethers.JsonRpcProvider(network);
  try {
    let blockNumber = await provider.getBlockNumber();
    log(`Current block number: ${blockNumber}`);
    connections.local.connected = true;
  } catch (error) {
    logger.error(`Could not connect to ${networkLabel} network at ${network}.`);
    deb(error);
  }

  // Check Sepolia testnet network connection (via Infura)
  networkLabel = "testnet";
  network = config.mapNetworkLabelToNetwork[networkLabel];
  msg = `Connecting to ${networkLabel} network at ${network}...`;
  log(msg);
  provider = new ethers.InfuraProvider(network, INFURA_API_KEY_NAME);
  try {
    let blockNumber = await provider.getBlockNumber();
    log(`Current block number: ${blockNumber}`);
    connections.testnet = {
      description: "Sepolia testnet",
      connected: true,
    };
  } catch (error) {
    logger.error(`Could not connect to ${networkLabel} network at ${network}.`);
    deb(error);
  }

  // Check Ethereum Mainnet network connection (via Infura)
  networkLabel = "mainnet";
  network = config.mapNetworkLabelToNetwork[networkLabel];
  msg = `Connecting to ${networkLabel} network at ${network}...`;
  log(msg);
  provider = new ethers.InfuraProvider(network, INFURA_API_KEY_NAME);
  try {
    let blockNumber = await provider.getBlockNumber();
    log(`Current block number: ${blockNumber}`);
    connections.mainnet = {
      description: "Ethereum Mainnet",
      connected: true,
    };
  } catch (error) {
    logger.error(`Could not connect to ${networkLabel} network at ${network}.`);
    deb(error);
  }

  // Display results
  console.log(`Network connections:`);
  _.forEach(connections, (connection, networkLabel) => {
    let { description, connected } = connection;
    let msg = `- ${networkLabel}: ${description} - ${
      connected ? "connected" : "not connected"
    }`;
    console.log(msg);
  });
}
