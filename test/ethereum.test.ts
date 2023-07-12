// Imports
import { ethers } from "ethers";
import { assert, expect } from "chai";

// Local imports
import ethereum from "#src/ethereum";
import { createLogger } from "#root/lib/logging";

// Controls
const logLevel = "error";

// Logging
const { logger, log, deb } = createLogger();
logger.setLevel({logLevel});


// Test data
const exampleAddress1 = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf";


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
      assert.throws(() => ethereum.validatePrivateKeySync({ privateKey }), Error);
    });

    it("Should throw an error if the private key is less than 32 bytes long", function () {
      const privateKey = "0x1234567890abcdef";
      assert.throws(() => ethereum.validatePrivateKeySync({ privateKey }), Error);
    });

    it("Should throw an error if the private key is more than 32 bytes long", function () {
      const privateKey = "0x" + "1234567890abcdef".repeat(4) + "1234";
      assert.throws(() => ethereum.validatePrivateKeySync({ privateKey }), Error);
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


});