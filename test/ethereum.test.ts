// Imports
import ethereum from "#src/ethereum";

import { ethers } from "ethers";
import { expect } from "chai";

// Tests

describe("Ethereum private key", function () {

  describe("Random key", function () {
    it("Should be 32 bytes", function () {
      const privateKey = ethereum.createPrivateKeySync();
      const check = ethers.isHexString(privateKey, 32);
      expect(check).to.equal(true);
    });
  });

});