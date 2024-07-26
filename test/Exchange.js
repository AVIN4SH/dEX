const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (number) => {
  return ethers.utils.parseUnits(number.toString(), "ether");
};

describe("Exchange", () => {
  let deployer, feeAccount, exchange;
  const feePercent = 10; //percent of fees that will be charged and is initialized as constant as it will be fixed

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });

    it("tracks the fee percent", async () => {
      expect(await exchange.feePercent()).to.equal(10);
    });
  });
});
