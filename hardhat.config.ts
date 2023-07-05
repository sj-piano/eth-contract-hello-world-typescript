import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import "@nomicfoundation/hardhat-toolbox";


dotenv.config();

const {
  ETHERSCAN_API_KEY,
  SEPOLIA_TESTNET_INFURA_API_URL,
  ETHEREUM_MAINNET_INFURA_API_URL,
  LOCAL_HARDHAT_PRIVATE_KEY: string,
  SEPOLIA_TESTNET_PRIVATE_KEY,
  ETHEREUM_MAINNET_PRIVATE_KEY,
} = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    local: {
      url: "http://localhost:8545",
      accounts: [LOCAL_HARDHAT_PRIVATE_KEY],
    },
    sepolia: {
      url: SEPOLIA_TESTNET_INFURA_API_URL,
      accounts: [SEPOLIA_TESTNET_PRIVATE_KEY],
    },
    mainnet: {
      url: ETHEREUM_MAINNET_INFURA_API_URL,
      accounts: [ETHEREUM_MAINNET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
