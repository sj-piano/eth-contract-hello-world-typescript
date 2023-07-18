// Imports
import Ajv from "ajv";
import Big from "big.js";
import { program } from "commander";
import { ethers } from "ethers";
import fs from "fs";
import Joi from "joi";
import _ from "lodash";

// Local imports
import { config } from "#root/config";
import ethereum from "#root/src/ethereum";
import { createLogger } from "#root/lib/logging";

// Load environment variables
import dotenv from "dotenv";
import path from "path";
let rootDir = __dirname.substring(0, __dirname.lastIndexOf("/"));
let envFile = path.join(rootDir, config.envFileName);
dotenv.config({ path: envFile });
const {
  MAX_FEE_PER_TRANSACTION_USD,
  MAX_FEE_PER_GAS_GWEI,
  MAX_PRIORITY_FEE_PER_GAS_GWEI,
  INFURA_API_KEY_NAME,
  LOCAL_HARDHAT_PRIVATE_KEY,
  LOCAL_HARDHAT_ADDRESS,
  SEPOLIA_TESTNET_PRIVATE_KEY,
  SEPOLIA_TESTNET_ADDRESS,
  ETHEREUM_MAINNET_PRIVATE_KEY,
  ETHEREUM_MAINNET_ADDRESS,
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
  .requiredOption(
    "--input-file-json <inputFileJson>",
    "Path to JSON file containing input data."
  );
program.parse();
const options = program.opts();
if (options.debug) console.log(options);
let { debug, logLevel, network: networkLabel, inputFileJson } = options;

// Process and validate arguments

ethereum.validatePrivateKeysSync({
  privateKeys: {
    LOCAL_HARDHAT_PRIVATE_KEY,
    SEPOLIA_TESTNET_PRIVATE_KEY,
    ETHEREUM_MAINNET_PRIVATE_KEY,
  },
});

ethereum.validateAddressesSync({
  addresses: {
    LOCAL_HARDHAT_ADDRESS,
    SEPOLIA_TESTNET_ADDRESS,
    ETHEREUM_MAINNET_ADDRESS,
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

if (!fs.existsSync(inputFileJson)) {
  console.error(`File "${inputFileJson}" not found.`);
  process.exit(1);
}
let inputData = JSON.parse(fs.readFileSync(inputFileJson).toString());

const ajv = new Ajv();
const inputJsonSchema = {
  type: "object",
  properties: {
    newMessage: { type: "string" },
  },
  required: ["newMessage"],
  additionalProperties: false,
};
const validateInputJson = ajv.compile(inputJsonSchema);
const validInputData = validateInputJson(inputData);
if (!validInputData) {
  console.error(validateInputJson.errors);
  process.exit(1);
}
let { newMessage }: { newMessage: string } = inputData;

// Setup

const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

let provider: ethers.Provider;

var msg: string = "Unknown error";
let DEPLOYER_PRIVATE_KEY: string | undefined;
let DEPLOYED_CONTRACT_ADDRESS: string | undefined;
if (networkLabel == "local") {
  msg = `Connecting to local network at ${network}...`;
  provider = new ethers.JsonRpcProvider(network);
  DEPLOYER_PRIVATE_KEY = LOCAL_HARDHAT_PRIVATE_KEY;
  DEPLOYED_CONTRACT_ADDRESS = LOCAL_HARDHAT_DEPLOYED_CONTRACT_ADDRESS;
} else if (networkLabel == "testnet") {
  msg = `Connecting to Sepolia testnet...`;
  provider = new ethers.InfuraProvider(network, INFURA_API_KEY_NAME);
  DEPLOYER_PRIVATE_KEY = SEPOLIA_TESTNET_PRIVATE_KEY;
  DEPLOYED_CONTRACT_ADDRESS = SEPOLIA_TESTNET_DEPLOYED_CONTRACT_ADDRESS;
} else if (networkLabel == "mainnet") {
  msg = `Connecting to Ethereum mainnet...`;
  provider = new ethers.InfuraProvider(network, INFURA_API_KEY_NAME);
  DEPLOYER_PRIVATE_KEY = ETHEREUM_MAINNET_PRIVATE_KEY;
  DEPLOYED_CONTRACT_ADDRESS = ETHEREUM_MAINNET_DEPLOYED_CONTRACT_ADDRESS;
}
log(msg);
provider = provider!;
DEPLOYER_PRIVATE_KEY = DEPLOYER_PRIVATE_KEY!;
let signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
if (!ethers.isAddress(DEPLOYED_CONTRACT_ADDRESS)) {
  logger.error(`Invalid contract address: ${DEPLOYED_CONTRACT_ADDRESS}`);
  process.exit(1);
}
const contractHelloWorld = new ethers.Contract(
  DEPLOYED_CONTRACT_ADDRESS,
  contract.abi,
  signer
);

// Run main function

main({ newMessage })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Functions

async function main({ newMessage }: { newMessage: string }) {
  let blockNumber = await provider.getBlockNumber();
  deb(`Current block number: ${blockNumber}`);

  let address = await contractHelloWorld.getAddress();
  let check = await ethereum.contractFoundAt({ provider, address });
  if (!check) {
    logger.error(`No contract found at address ${address}.`);
    process.exit(1);
  }
  log(`Contract found at address: ${address}`);

  // Interact with contract.
  await updateMessage({ newMessage });
}

async function updateMessage({ newMessage }: { newMessage: string }) {
  const message = await contractHelloWorld.message();
  log("Message stored in HelloWorld contract: " + message);

  // Estimate fees.
  // - Stop if any fee limit is exceeded.
  const txRequest = await contractHelloWorld.update.populateTransaction(
    newMessage
  );
  const estimatedFees = await ethereum.estimateFees({
    provider,
    txRequest,
  });
  deb(estimatedFees);
  const {
    gasLimit,
    maxFeePerGasWei,
    maxPriorityFeePerGasWei,
    feeEth,
    feeUsd,
    feeLimitChecks,
  } = estimatedFees;
  log(`Estimated fee: ${feeEth} ETH (${feeUsd} USD)`);
  if (feeLimitChecks.anyLimitExceeded) {
    for (let key of feeLimitChecks.limitExceededKeys) {
      let check = feeLimitChecks[key];
      console.error(`- ${key}: ${check.msg}`);
    }
    process.exit(1);
  }
  const gasPrices = estimatedFees.gasPrices;
  const { ethToUsd } = gasPrices;

  // Get ETH balance of signer.
  // - Stop if balance is too low.
  const signerAddress = await signer.getAddress();
  const signerBalanceWei = await provider.getBalance(signerAddress);
  const signerBalanceEth = ethers.formatEther(signerBalanceWei);
  const signerBalanceUsd = Big(ethToUsd)
    .mul(Big(signerBalanceEth))
    .toFixed(config.USD_DP);
  log(`Signer balance: ${signerBalanceEth} ETH (${signerBalanceUsd} USD)`);
  if (Big(signerBalanceEth).lt(Big(feeEth))) {
    console.error(
      `Sender address (${signerAddress}) has a balance that is too low (${signerBalanceEth} ETH). At least ${feeEth} ETH is needed to pay for the deployment transaction.`
    );
    process.exit(1);
  }

  // Deploy contract.
  // - Use the estimated fee values.
  // - Wait for deployment to complete.
  log("Updating the message...");
  try {
    var tx = await contractHelloWorld.update(newMessage, {
      gasLimit,
      maxFeePerGas: maxFeePerGasWei,
      maxPriorityFeePerGas: maxPriorityFeePerGasWei,
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      let errorName = error.code; // e.g. UNKNOWN_ERROR
      let errorMessage = error.message;
      // Example errorMessage: Transaction maxFeePerGas (200000000) is too low for the next block, which has a baseFeePerGas of 264952691
      let errorStackTrace = error.stack;
      //logger.error(errorStackTrace);
    }
  }

  deb(tx);

  const txReceipt = await tx.wait();

  if (txReceipt.status !== 1) {
    console.error(txReceipt);
    process.exit(1);
  }

  deb(txReceipt);

  // Examine the results and find out how much was spent.

  let {
    accessList,
    chainId,
    data,
    from,
    gasLimit: txReceiptGasLimit,
    hash,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    signature,
    to,
    type,
    value,
  } = tx;
  let {
    blockNumber,
    blockHash,
    contractAddress: newContractAddress,
    index,
    logsBloom,
    gasUsed,
    cumulativeGasUsed,
    gasPrice: effectiveGasPrice,
    status,
  } = txReceipt;

  deb(tx);
  deb(txReceipt);

  deb(`gasLimit: ${txReceiptGasLimit}`);
  deb(`maxPriorityFeePerGas: ${maxPriorityFeePerGas}`);
  deb(`maxFeePerGas: ${maxFeePerGas}`);
  deb(`gasUsed: ${gasUsed}`);
  deb(`effectiveGasPrice: ${effectiveGasPrice}`);

  const txFeeWeiCalculated = gasUsed * effectiveGasPrice;
  deb(`txFeeWeiCalculated: ${txFeeWeiCalculated}`);

  const txFeeWei = txReceipt.fee;
  deb(`txFeeWei: ${txFeeWei}`);
  const txFeeEth = ethers.formatEther(txFeeWei).toString();
  const txFeeUsd = Big(ethToUsd).mul(Big(txFeeEth)).toFixed(config.USD_DP);
  log(`Final fee: ${txFeeEth} ETH (${txFeeUsd} USD)`);

  // Report the final result.
  const message2 = await contractHelloWorld.message();
  console.log("The new message is: ");
  console.log(message2);
}
