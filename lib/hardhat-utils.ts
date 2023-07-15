// Imports
import hardhat, { ethers } from "hardhat";

function getHardhatKeypairs() {
  let keypairs = [];
  for (let i = 0; i < 20; i++) {
    keypairs.push(getHardhatKeypair({ index: i }));
  }
  return keypairs;
}

function getHardhatKeypair({ index }: { index: number }) {
  if (index > 20) {
    throw new Error("Hardhat only supports 20 accounts");
  }
  const accounts: any = hardhat.config.networks.hardhat.accounts;
  let mnemonic = ethers.Mnemonic.fromPhrase(accounts.mnemonic);
  const wallet = ethers.HDNodeWallet.fromMnemonic(
    mnemonic,
    accounts.path + `/${index}`
  );
  const privateKey = wallet.privateKey;
  const address = wallet.address;
  return { privateKey, address };
}

export { getHardhatKeypairs, getHardhatKeypair };
