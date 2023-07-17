// Imports
import hardhat, { ethers } from "hardhat";
//import helpers from "@nomicfoundation/hardhat-network-helpers";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { assert, expect, util } from "chai";
import _ from "lodash";

// Local imports
import amounts from "#src/amounts";
import { config } from "#root/config";
import ethereum from "#src/ethereum";
import { createLogger } from "#root/lib/logging";
import utils from "#root/lib/utils";

// Environment variables
import "dotenv/config";
const {
  MAX_FEE_PER_TRANSACTION_USD,
  MAX_FEE_PER_GAS_GWEI,
  MAX_PRIORITY_FEE_PER_GAS_GWEI,
} = process.env;

// Controls
let logLevel = "error";
logLevel = "info";
//logLevel = "debug";

// Logging
const { logger, log, deb } = createLogger({ fileName: __filename, logLevel });

// Test data
const exampleAddress1 = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf";

// Setup
let hre = hardhat;
let provider = hre.ethers.provider;
let network = hre.network;
const networkLabel = "local";
config.update({
  MAX_FEE_PER_TRANSACTION_USD,
  MAX_FEE_PER_GAS_GWEI,
  MAX_PRIORITY_FEE_PER_GAS_GWEI,
});

// Tests

describe("Ethereum private key", function () {
  describe("Create random key", function () {
    it("Should be a hex string", function () {
      const privateKey = ethereum.createPrivateKeySync();
      const check = ethers.isHexString(privateKey);
      expect(check).to.equal(true);
    });

    it("Should be 32 bytes long", function () {
      const privateKey = ethereum.createPrivateKeySync();
      const check = ethers.isHexString(privateKey, 32);
      expect(check).to.equal(true);
    });
  });

  describe("Test validatePrivateKeySync", function () {
    it("Should validate a new private key", function () {
      const privateKey = ethereum.createPrivateKeySync();
      const check = ethereum.validatePrivateKeySync({ privateKey });
      expect(check).to.equal(true);
    });

    it("Should throw an error if the private key is not a hex string", function () {
      const privateKey = "0x1234567890abcdef" + "zzzz";
      assert.throws(
        () => ethereum.validatePrivateKeySync({ privateKey }),
        Error
      );
    });

    it("Should throw an error if the private key is less than 32 bytes long", function () {
      const privateKey = "0x1234567890abcdef";
      assert.throws(
        () => ethereum.validatePrivateKeySync({ privateKey }),
        Error
      );
    });

    it("Should throw an error if the private key is more than 32 bytes long", function () {
      const privateKey = "0x" + "1234567890abcdef".repeat(4) + "1234";
      assert.throws(
        () => ethereum.validatePrivateKeySync({ privateKey }),
        Error
      );
    });
  });

  describe("Test deriveAddressSync", function () {
    it("Should derive the correct address from a private key", function () {
      const privateKey = "0x" + "00".repeat(31) + "01";
      const address = ethereum.deriveAddressSync({ privateKey });
      expect(address).to.equal(exampleAddress1);
    });
  });

  describe("Test validateAddressSync", function () {
    it("Should validate a valid address", function () {
      const address = exampleAddress1;
      const check = ethereum.validateAddressSync({ address });
      expect(check).to.equal(true);
    });
  });

  describe("Test basic transactions", function () {
    beforeEach(async function () {
      await hre.network.provider.send("hardhat_reset");
    });

    it("Should transfer 0 wei", async function () {
      const [addr1, addr2] = await ethers.getSigners();
      let addr1Balance = await ethereum.getBalanceETH({
        provider,
        address: addr1.address,
      });
      let addr2Balance = await ethereum.getBalanceETH({
        provider,
        address: addr2.address,
      });
      let amountWei = "0";
      let amountEth = amounts.weiToEth({ amountWei });
      let txResponse = await ethereum.sendEth({
        networkLabel,
        provider,
        senderAddress: addr1.address,
        receiverAddress: addr2.address,
        amountEth,
      });
      //log(txResponse)
      let txHash = txResponse.hash;
      let txReceipt = await provider.getTransactionReceipt(txHash);
      let block = await provider.getBlock("latest");
      expect(block!.number).to.equal(1);
      let addr1Balance2 = await ethereum.getBalanceETH({
        provider,
        address: addr1.address,
      });
      let addr2Balance2 = await ethereum.getBalanceETH({
        provider,
        address: addr2.address,
      });
      let differenceWei =
        ethers.parseEther(addr2Balance2) - ethers.parseEther(addr2Balance);
      expect(differenceWei).to.equal(0);
    });

    it("Should transfer 1 wei", async function () {
      let result = await provider.send("hardhat_getAutomine");
      deb("result", result);

      await provider.send("evm_setAutomine", [false]);

      let automineOn = await provider.send("hardhat_getAutomine");
      deb(`automineOn=${automineOn}`);

      let block = await provider.getBlock("latest");
      deb(`Current block number: ${block!.number}`);

      const [addr1, addr2] = await ethers.getSigners();

      let addr1Balance = await ethereum.getBalanceETH({
        provider,
        address: addr1.address,
      });
      //log("addr1Balance", addr1Balance);
      let addr2Balance = await ethereum.getBalanceETH({
        provider,
        address: addr2.address,
      });
      //log("addr2Balance", addr2Balance);

      let amountWei = "1";
      let amountEth = amounts.weiToEth({ amountWei });

      let txResponse = await ethereum.sendEth({
        networkLabel,
        provider,
        senderAddress: addr1.address,
        receiverAddress: addr2.address,
        amountEth,
      });
      //log(txResponse)

      let txHash = txResponse.hash;
      let requiredConfirms = 12;
      let confirms;

      //confirms = await ethereum.getTxConfirms({ provider, txHash });
      //log("Tx confirms", confirms);

      await helpers.mine(10);

      //confirms = await ethereum.getTxConfirms({ provider, txHash });
      //log("Tx confirms", confirms);

      await helpers.mine(2);

      confirms = await ethereum.getTxConfirms({ provider, txHash });
      //log("Tx confirms", confirms);

      expect(confirms).to.equal(requiredConfirms);

      //log("addr1.address", addr1.address);
      //log("addr2.address", addr2.address);

      let addr1Balance2 = await ethereum.getBalanceETH({
        provider,
        address: addr1.address,
      });
      //log("addr1Balance2", addr1Balance2);

      let addr2Balance2 = await ethereum.getBalanceETH({
        provider,
        address: addr2.address,
      });
      //log("addr2Balance2", addr2Balance2);

      let differenceWei =
        ethers.parseEther(addr2Balance2) - ethers.parseEther(addr2Balance);
      expect(differenceWei).to.equal(1);

      let { txFeeWei, txFeeEth } = await ethereum.getTxFees({
        provider,
        txHash,
      });

      let calculatedSpend = Number(amountWei) + Number(txFeeWei);
      let spent =
        ethers.parseEther(addr1Balance) - ethers.parseEther(addr1Balance2);
      expect(spent).to.equal(calculatedSpend);
    });
  });
});
