// Imports
const axios = require("axios");
const Big = require("big.js");
const crypto = require("crypto");
const ethers = require("ethers");
const _ = require("lodash");

// Local imports
import { validateConfig } from "#root/config";
import { createLogger } from "#root/lib/logging";
import { validateNumericString } from "#root/lib/utils";

// Functions

function createPrivateKeySync() {
  const randomBytes = crypto.randomBytes(32);
  const privateKey = `0x` + randomBytes.toString("hex");
  return privateKey;
}

function validatePrivateKeySync({ privateKey, name }) {
  if (!ethers.isHexString(privateKey, 32)) {
    let nameSection = !_.isUndefined(name) ? `${name} ` : "";
    let msg = `Private key ${nameSection}("${privateKey}") is invalid.`;
    throw new Error(msg);
  }
  return privateKey;
}

function validatePrivateKeysSync({ privateKeys }) {
  if (_.isArray(privateKeys)) {
    throw new Error(
      `Private keys "${privateKeys}" must be an object, not an array.`
    );
  }
  if (!_.isObject(privateKeys)) {
    throw new Error(`Private keys "${privateKeys}" must be an object.`);
  }
  if (!_.keys(privateKeys).length) {
    throw new Error(`Private keys "${privateKeys}" must not be empty.`);
  }
  for (const [name, privateKey] of _.entries(privateKeys)) {
    validatePrivateKeySync({ privateKey, name });
  }
  return privateKeys;
}

function deriveAddressSync({ privateKey }) {
  validatePrivateKeySync({ privateKey });
  const wallet = new ethers.Wallet(privateKey);
  const address = wallet.address;
  return address;
}

function validateAddressSync({ address, name }) {
  if (!ethers.isAddress(address)) {
    let nameSection = !_.isUndefined(name) ? `${name} ` : "";
    let msg = `Address ${nameSection}("${address}") is invalid.`;
    throw new Error(msg);
  }
  return address;
}

function validateAddressesSync({ addresses }) {
  if (_.isArray(addresses)) {
    throw new Error(
      `Addresses "${addresses}" must be an object, not an array.`
    );
  }
  if (!_.isObject(addresses)) {
    throw new Error(`Addresses "${addresses}" must be an object.`);
  }
  if (!_.keys(addresses).length) {
    throw new Error(`Addresses "${addresses}" must not be empty.`);
  }
  for (const [name, address] of _.entries(addresses)) {
    validateAddressSync({ address, name });
  }
  return addresses;
}

async function contractFoundAt({ logger, provider, address }) {
  if (!ethers.isAddress(address)) {
    throw new Error(`Address "${address}" is invalid.`);
  }
  let result = await provider.getCode(address);
  if (result == "0x") return false;
  return true;
}

async function getGasPrices({ logger, provider }) {
  const block = await provider.getBlock("latest");
  const blockNumber = block.number.toString();
  const baseFeePerGasWei = block.baseFeePerGas.toString();
  const feeData = await provider.getFeeData();
  const { gasPrice } = feeData;
  const gasPriceWei = gasPrice.toString();
  const averagePriorityFeePerGasWei = (
    BigInt(gasPriceWei) - BigInt(baseFeePerGasWei)
  ).toString();
  // Convert values to Gwei and Ether.
  const baseFeePerGasGwei = ethers.formatUnits(baseFeePerGasWei, "gwei");
  const baseFeePerGasEth = ethers.formatUnits(baseFeePerGasWei, "ether");
  const gasPriceGwei = ethers.formatUnits(gasPriceWei, "gwei");
  const gasPriceEth = ethers.formatUnits(gasPriceWei, "ether");
  const averagePriorityFeePerGasGwei = ethers.formatUnits(
    averagePriorityFeePerGasWei,
    "gwei"
  );
  const averagePriorityFeePerGasEth = ethers.formatUnits(
    averagePriorityFeePerGasWei,
    "ether"
  );
  return {
    blockNumber,
    baseFeePerGasWei,
    gasPriceWei,
    averagePriorityFeePerGasWei,
    // Gwei and Ether values:
    baseFeePerGasGwei,
    baseFeePerGasEth,
    gasPriceGwei,
    gasPriceEth,
    averagePriorityFeePerGasGwei,
    averagePriorityFeePerGasEth,
  };
}

async function getEthereumPriceInUsd({ logger, config }) {
  validateConfig({ config });
  try {
    const response = await axios.get(config.eth_usd_price_url);
    const price = response.data.price;
    return price;
  } catch (error) {
    console.error("Error fetching price:", error.message);
    throw error;
  }
}

async function getGasPricesWithFiat({ config, logger, provider }) {
  validateConfig({ config });
  // Include fiat values for gas prices.
  const gasPrices = await getGasPrices({ logger, provider });
  const ethToUsd = await getEthereumPriceInUsd({ logger, config });
  const baseFeePerGasUsd = (
    Big(gasPrices.baseFeePerGasEth) * Big(ethToUsd)
  ).toFixed(config.ETH_DP);
  const gasPriceUsd = (Big(gasPrices.gasPriceEth) * Big(ethToUsd)).toFixed(
    config.ETH_DP
  );
  const averagePriorityFeePerGasUsd = (
    Big(gasPrices.averagePriorityFeePerGasEth) * Big(ethToUsd)
  ).toFixed(config.ETH_DP);
  return {
    ...gasPrices,
    ethToUsd,
    baseFeePerGasUsd,
    gasPriceUsd,
    averagePriorityFeePerGasUsd,
  };
}

async function estimateFees({ config, logger, provider, txRequest }) {
  // We examine a specific transaction request and estimate its fees, taking into account the limits specified in config.
  validateConfig({ config });
  const { log, deb } = logger;
  let feeLimitKeys = "baseFeePerGasWei baseFeeUsd maxFeeUsd".split(" ");
  let feeLimitChecks = {};
  feeLimitKeys.forEach((key) => {
    feeLimitChecks[key] = { exceeded: false, msg: "" };
  });
  feeLimitChecks.limitExceededKeys = [];
  feeLimitChecks.anyLimitExceeded = false;
  const estimatedGasBigInt = await provider.estimateGas(txRequest);
  const estimatedGas = estimatedGasBigInt.toString();
  deb(`estimatedGas: ${estimatedGas}`);
  const gasLimit = Big(estimatedGas)
    .mul(Big(config.gasLimitMultiplier))
    .toFixed(0);
  deb(`gasLimit: ${gasLimit}`);
  const gasPrices = await getGasPricesWithFiat({ config, logger, provider });
  const {
    baseFeePerGasWei,
    baseFeePerGasGwei,
    averagePriorityFeePerGasWei,
    ethToUsd,
  } = gasPrices;
  // Check if the base-fee-per-gas is greater than our Wei limit.
  if (Big(baseFeePerGasWei).gt(Big(config.maxFeePerGasWei))) {
    let msg = `Current base fee per gas (${baseFeePerGasGwei} gwei, ${baseFeePerGasWei} wei) exceeds limit specified in config (${config.maxFeePerGasGwei} gwei, ${config.maxFeePerGasWei} wei).`;
    feeLimitChecks.baseFeePerGasWei = { exceeded: true, msg };
  }
  // Check if the base fee is greater than our USD limit.
  const baseFeeWei = (Big(estimatedGas) * Big(baseFeePerGasWei)).toFixed(
    config.WEI_DP
  );
  deb(`baseFeeWei: ${baseFeeWei} wei`);
  const baseFeeGwei = ethers.formatUnits(baseFeeWei, "gwei");
  const baseFeeEth = ethers.formatEther(baseFeeWei).toString();
  const baseFeeUsd = (Big(baseFeeEth) * Big(ethToUsd)).toFixed(config.USD_DP);
  deb(`baseFeeUsd: ${baseFeeUsd} USD`);
  if (Big(baseFeeUsd).gt(Big(config.maxFeePerTransactionUsd))) {
    let msg = `Base fee (${baseFeeUsd} USD) exceeds limit specified in config (${config.maxFeePerTransactionUsd} USD).`;
    msg += ` Current base fee is ${baseFeeGwei} gwei (${baseFeeWei} wei, ${baseFeeEth} ETH). Current ETH-USD exchange rate is ${ethToUsd} USD.`;
    feeLimitChecks.baseFeeUsd = { exceeded: true, msg };
  }
  // Calculate a maxFeePerGasWei for this transaction, based on the current ETH-USD price.
  // - Using this limit will prevent the later addition of a priority fee from exceeding our USD limit.
  const feeLimitEth = Big(config.maxFeePerTransactionUsd)
    .div(Big(ethToUsd))
    .toFixed(config.ETH_DP);
  deb(`feeLimitEth: ${feeLimitEth} ETH`);
  const feeLimitWei = ethers.parseEther(feeLimitEth).toString();
  deb(`feeLimitWei: ${feeLimitWei} wei`);
  const maxFeePerGasWei = Big(feeLimitWei)
    .div(Big(estimatedGas))
    .toFixed(config.WEI_DP);
  deb(`maxFeePerGasWei: ${maxFeePerGasWei} wei`);
  // Calculate a max-priority-fee-per-gas for this transaction.
  // - We choose a max priority fee that is a multiple of the average priority fee.
  // - If it exceeds our max-priority-fee-per-gas limit (set in config), reduce it to the limit.
  let maxPriorityFeePerGasWei = (
    Big(averagePriorityFeePerGasWei) * Big(config.averagePriorityFeeMultiplier)
  ).toFixed(config.WEI_DP);
  if (Big(maxPriorityFeePerGasWei).gt(Big(config.maxPriorityFeePerGasWei))) {
    let msg = `Max priority fee per gas (${maxPriorityFeePerGasWei} wei) exceeds limit specified in config (${config.maxPriorityFeePerGasWei} wei).`;
    msg += ` Using config limit instead.`;
    let comparatorWord = Big(averagePriorityFeePerGasWei).gt(
      Big(config.maxPriorityFeePerGasWei)
    )
      ? "greater"
      : "less";
    msg += ` Note: averagePriorityFeePerGasWei = ${averagePriorityFeePerGasWei} wei, which is ${comparatorWord} than config limit.`;
    deb(msg);
    maxPriorityFeePerGasWei = config.maxPriorityFeePerGasWei;
  }
  deb(`maxPriorityFeePerGasWei: ${maxPriorityFeePerGasWei} wei`);
  // Calculate the max possible fee.
  const maxPriorityFeeWei = Big(estimatedGas)
    .mul(Big(maxPriorityFeePerGasWei))
    .toFixed(config.WEI_DP);
  deb(`maxPriorityFeeWei: ${maxPriorityFeeWei} wei`);
  const maxPriorityFeeGwei = ethers.formatUnits(maxPriorityFeeWei, "gwei");
  const maxPriorityFeeEth = ethers.formatEther(maxPriorityFeeWei).toString();
  const maxPriorityFeeUsd = (Big(maxPriorityFeeEth) * Big(ethToUsd)).toFixed(
    config.USD_DP
  );
  const maxFeeWei = Big(baseFeeWei)
    .plus(Big(maxPriorityFeeWei))
    .toFixed(config.WEI_DP);
  deb(`maxFeeWei: ${maxFeeWei} wei`);
  const maxFeeGwei = ethers.formatUnits(maxFeeWei, "gwei");
  const maxFeeEth = ethers.formatEther(maxFeeWei).toString();
  const maxFeeUsd = (Big(maxFeeEth) * Big(ethToUsd)).toFixed(config.USD_DP);
  deb(`maxFeeUsd: ${maxFeeUsd} USD`);
  // Handle the situation where the base fee is below the limit, but the max fee is above it.
  if (
    !feeLimitChecks.baseFeeUsd.exceeded &&
    Big(maxFeeUsd).gt(Big(config.maxFeePerTransactionUsd))
  ) {
    let msg = `Max fee (${maxFeeUsd} USD) exceeds limit specified in config (${config.maxFeePerTransactionUsd} USD).`;
    let unusablePriorityFeeUsd = Big(maxFeeUsd)
      .minus(Big(config.maxFeePerTransactionUsd))
      .toFixed(config.USD_DP);
    let unusablePriorityFeeEth = Big(unusablePriorityFeeUsd)
      .div(Big(ethToUsd))
      .toFixed(config.ETH_DP);
    let unusablePriorityFeeWei = ethers
      .parseEther(unusablePriorityFeeEth)
      .toString();
    let unusablePriorityFeeGwei = ethers.formatUnits(
      unusablePriorityFeeWei,
      "gwei"
    );
    let msg2 = ` The transaction won't be able to use its entire priority fee. Unusable amount = (${unusablePriorityFeeGwei} Gwei, ${unusablePriorityFeeUsd} USD), out of total available = (${maxPriorityFeeGwei} gwei, ${maxPriorityFeeUsd} USD).`;
    msg += msg2;
    deb(msg);
    feeLimitChecks.maxFeeUsd = { exceeded: true, msg };
  }
  // Note: We assume here that the fee will use the entire available priority fee, but it might not.
  let feeWei = maxFeeWei;
  let feeGwei = maxFeeGwei;
  let feeEth = maxFeeEth;
  let feeUsd = maxFeeUsd;
  // If we've passed a USD feeLimit, we re-calculate the final fee estimates backwards from maxFeePerTransactionUsd.
  if (feeLimitChecks.baseFeeUsd.exceeded || feeLimitChecks.maxFeeUsd.exceeded) {
    feeUsd = config.maxFeePerTransactionUsd;
    feeEth = Big(feeUsd).div(Big(ethToUsd)).toFixed(config.ETH_DP);
    feeWei = ethers.parseEther(feeEth).toString();
    feeGwei = ethers.formatUnits(feeWei, "gwei");
  }
  // Set the anyLimitExceeded flag.
  feeLimitKeys.forEach((key) => {
    if (feeLimitChecks[key].exceeded) {
      feeLimitChecks.limitExceededKeys.push(key);
      feeLimitChecks.anyLimitExceeded = true;
    }
  });
  return {
    gasPrices,
    estimatedGas,
    gasLimit,
    maxFeePerGasWei,
    maxPriorityFeePerGasWei,
    baseFeeWei,
    baseFeeGwei,
    baseFeeEth,
    baseFeeUsd,
    maxPriorityFeeWei,
    maxPriorityFeeGwei,
    maxPriorityFeeEth,
    maxPriorityFeeUsd,
    feeWei,
    feeGwei,
    feeEth,
    feeUsd,
    feeLimitChecks,
  };
}

// Exports
module.exports = {
  createPrivateKeySync,
  validatePrivateKeySync,
  validatePrivateKeysSync,
  deriveAddressSync,
  validateAddressSync,
  validateAddressesSync,
  contractFoundAt,
  getGasPrices,
  getEthereumPriceInUsd,
  getGasPricesWithFiat,
  estimateFees,
};
