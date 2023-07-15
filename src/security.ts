/* Description:
- Receive address, networkLabel, and txRequest.
- Use address and networkLabel to look up the correct private key.
- Sign txRequest with private key to produce tx.
*/

// Imports
import _ from "lodash";
import { ethers, Provider, TransactionRequest } from "ethers";

// Local imports
import { getHardhatKeypairs } from "#root/lib/hardhat-utils";
import { createLogger } from "#root/lib/logging";

// Controls
let logLevel = "error";
logLevel = "info";

// Logging
const { logger, log, deb } = createLogger({fileName: __filename, logLevel});


async function signTransaction({ provider, senderAddress, networkLabel, txRequest }: {
  provider: Provider,
  senderAddress: string,
  networkLabel: string,
  txRequest: any,
}) {
  let privateKey = "";
  let found = false;
  if (networkLabel == "local") {
    // Get private key from hardhat
    const keypairs = getHardhatKeypairs();
    for (let keypair of keypairs) {
      if (keypair.address == senderAddress) {
        privateKey = keypair.privateKey;
        found = true;
      }
    }
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
}
