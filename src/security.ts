/* Description:
- Receive address, networkLabel, and txRequest.
- Use address and networkLabel to look up the correct private key.
- Sign txRequest with private key to produce tx.
*/

// Imports
import _ from "lodash";
import { ethers, Provider, TransactionRequest } from "ethers";

// Local imports
import { config } from "#root/config";
import { createLogger } from "#root/lib/logging";
import utils from "#root/lib/utils";

// Environment variables
import dotenv from 'dotenv';
import path from 'path';
let rootDir = __dirname.substring(0, __dirname.lastIndexOf('/'));
let envFile = path.join(rootDir, config.envFileName);
dotenv.config({ path: envFile });
const { LOCAL_HARDHAT_MNEMONIC_PHRASE } = utils.getEnvVar({name: "LOCAL_HARDHAT_MNEMONIC_PHRASE"});

// Controls
let logLevel = "error";
logLevel = "info";

// Logging
const { logger, log, deb } = createLogger({ fileName: __filename, logLevel });


// Functions

async function signTransaction({
  networkLabel,
  provider,
  senderAddress,
  txRequest,
}: {
  networkLabel: string;
  provider: Provider;
  senderAddress: string;
  txRequest: TransactionRequest;
}) {
  let privateKey = "";
  let found = false;
  if (networkLabel == "local") {
    // Iterate over hardhat mnemonic to find the correct private key.
    let index = 0;
    const mnemonic = ethers.Mnemonic.fromPhrase(LOCAL_HARDHAT_MNEMONIC_PHRASE);
    const derivationPath = "m/44'/60'/0'/0";
    while (!found && index < 20) {
      const wallet = ethers.HDNodeWallet.fromMnemonic(
        mnemonic,
        derivationPath + `/${index}`,
      );
      if (wallet.address == senderAddress) {
        found = true;
        privateKey = wallet.privateKey;
      }
    }
  } else if (networkLabel == "testnet") {
    throw new Error(`Network support not implemented yet: ${networkLabel}`);
  } else if (networkLabel == "mainnet") {
    throw new Error(`Network support not implemented yet: ${networkLabel}`);
  } else {
    throw new Error(`Unsupported networkLabel: ${networkLabel}`);
  }
  if (!found) {
    throw new Error(`Could not find private key for address: ${senderAddress}`);
  }
  const signer = new ethers.Wallet(privateKey, provider);
  const tx = await signer.signTransaction(txRequest);
  return tx;
}

export default {
  signTransaction,
};
