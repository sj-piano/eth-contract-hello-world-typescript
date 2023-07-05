// Imports
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({path: './user-config.env'});

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;
const SEPOLIA_TESTNET_INFURA_API_URL = process.env.SEPOLIA_TESTNET_INFURA_API_URL!;
const ETHEREUM_MAINNET_INFURA_API_URL = process.env.ETHEREUM_MAINNET_INFURA_API_URL!;
const LOCAL_HARDHAT_PRIVATE_KEY = process.env.LOCAL_HARDHAT_PRIVATE_KEY!;
const SEPOLIA_TESTNET_PRIVATE_KEY = process.env.SEPOLIA_TESTNET_PRIVATE_KEY!;
const ETHEREUM_MAINNET_PRIVATE_KEY = process.env.ETHEREUM_MAINNET_PRIVATE_KEY!;

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
