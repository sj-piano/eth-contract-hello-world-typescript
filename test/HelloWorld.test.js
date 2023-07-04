// Imports
const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// Tests

describe("HelloWorld contract", function () {
  // We use `loadFixture` to share common setups (or fixtures) between tests.
  // Using this simplifies your tests and makes them run faster, by taking
  // advantage of Hardhat Network's snapshot functionality.
  async function deployHelloWorldFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const initialMessage = "Hello World!";
    const constructorArgs = [initialMessage];
    const contractHelloWorld = await ethers.deployContract(
      "HelloWorld",
      constructorArgs
    );
    return { contractHelloWorld, initialMessage, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the initial message supplied to the constructor", async function () {
      const { contractHelloWorld, initialMessage } = await loadFixture(
        deployHelloWorldFixture
      );
      const message = await contractHelloWorld.message();
      expect(message).to.equal(initialMessage);
    });
  });

  describe("Update", function () {
    it("Should update the message", async function () {
      const { contractHelloWorld, initialMessage } = await loadFixture(
        deployHelloWorldFixture
      );
      const newMessage = "New message.";
      await contractHelloWorld.update(newMessage);
      const message = await contractHelloWorld.message();
      expect(message).to.equal(newMessage);
    });

    it("Should set message to be empty when the message value is an integer", async function () {
      const { contractHelloWorld, initialMessage } = await loadFixture(
        deployHelloWorldFixture
      );
      const newMessage = 123;
      await contractHelloWorld.update(newMessage);
      const message = await contractHelloWorld.message();
      expect(message).to.equal("");
    });
  });
});
