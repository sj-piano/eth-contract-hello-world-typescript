// Imports
import Big from "big.js";
import crypto from "crypto";
import { ethers } from "ethers";
import _ from "lodash";

// Local imports
import { Config, config } from "#root/config";
import { Logger, createLogger } from "#root/lib/logging";

// Controls
let logLevel = "error";
logLevel = "info";

// Logging
const { logger, log, deb } = createLogger({ logLevel });

// Constants
let weiPerEth = Big(10 ** 18);
let gweiPerEth = Big(10 ** 9);
let weiPerGwei = Big(10 ** 9);

// Setup
let { WEI_DP, GWEI_DP, ETH_DP, USD_DP } = config;

function weiToEth({ amountWei }: { amountWei: string }) {
  const amountEth = Big(amountWei).div(weiPerEth).toFixed(ETH_DP);
  return amountEth;
}

function ethToWei({ amountEth }: { amountEth: string }) {
  const amountWei = Big(amountEth).times(weiPerEth).toFixed(WEI_DP);
  return amountWei;
}

export default {
  weiToEth,
  ethToWei,
};
