// Package configuration values, stored in a class.

// Imports
const { ethers } = require("ethers");
const Joi = require("joi");
const _ = require("lodash");

// Local imports
const { validateNumericString } = require("#root/lib/utils.js");

/* Notes:
- The main application or script will load the config, apply changes from cmdline arguments and environment variables if required, and pass it to the other modules or functions as an object.
- When we create a transaction, we find the current averagePriorityFeePerGas, and multiply it by averagePriorityFeeMultiplier to get our transaction-specific value for maxPriorityFeePerGas. However, we don't permit it to be greater than maxPriorityFeePerGasGwei.
*/

class Config {
  constructor() {
    // Note: maxFeePerTransactionUsd overrides the other fee limits.
    this.maxFeePerTransactionUsd = "0";
    this.maxFeePerGasGwei = "0";
    this.maxPriorityFeePerGasGwei = "0";
    this.gasLimitMultiplier = "1.0";
    this.averagePriorityFeeMultiplier = "1.5";
    this.eth_usd_price_url =
      "https://api.pro.coinbase.com/products/ETH-USD/ticker";
    this.maxFeePerGasWei = "0";
    this.maxPriorityFeePerGasWei = "0";
    this.networkLabelList = "local testnet mainnet".split(" ");
    this.mapNetworkLabelToNetwork = {
      local: "http://localhost:8545",
      testnet: "sepolia",
      mainnet: "mainnet",
    };
    this.logLevelList = "debug info warn error".split(" ");
    // DP = Decimal Places
    this.WEI_DP = 0;
    this.GWEI_DP = 9;
    this.ETH_DP = 18;
    this.USD_DP = 2;
    this.dummyAddress = "0x000000000000000000000000000000000000dEaD";
  }

  // Setters

  set maxFeePerGasGwei(newValue) {
    this._maxFeePerGasGwei = newValue;
    this.maxFeePerGasWei = ethers.parseUnits(newValue, "gwei").toString();
  }

  set maxPriorityFeePerGasGwei(newValue) {
    this._maxPriorityFeePerGasGwei = newValue;
    this.maxPriorityFeePerGasWei = ethers
      .parseUnits(newValue, "gwei")
      .toString();
  }

  // Methods

  update({
    MAX_FEE_PER_TRANSACTION_USD,
    MAX_FEE_PER_GAS_GWEI,
    MAX_PRIORITY_FEE_PER_GAS_GWEI,
  }) {
    if (!_.isNil(MAX_FEE_PER_GAS_GWEI)) {
      this.maxFeePerTransactionUsd = validateNumericString({
        name: "MAX_FEE_PER_TRANSACTION_USD",
        value: MAX_FEE_PER_TRANSACTION_USD,
      });
    }
    if (!_.isNil(MAX_FEE_PER_GAS_GWEI)) {
      this.maxFeePerGasGwei = validateNumericString({
        name: "MAX_FEE_PER_GAS_GWEI",
        value: MAX_FEE_PER_GAS_GWEI,
      });
    }
    if (!_.isNil(MAX_PRIORITY_FEE_PER_GAS_GWEI)) {
      this.maxPriorityFeePerGasGwei = validateNumericString({
        name: "MAX_PRIORITY_FEE_PER_GAS_GWEI",
        value: MAX_PRIORITY_FEE_PER_GAS_GWEI,
      });
    }
  }
}

async function validateConfig({ config }) {
  // For now, just confirm that it's an object.
  let schema = Joi.object().required();
  let result = schema.validate(config);
  if (result.error) {
    console.error(`config: ${config}`);
    throw new Error(`Invalid config: ${result.error}`);
  }
  return config;
}

module.exports = {
  config: new Config(),
  validateConfig,
};
