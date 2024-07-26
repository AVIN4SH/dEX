const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (number) => {
  return ethers.utils.parseUnits(number.toString(), "ether");
};

describe("Exchange", () => {
  let deployer, feeAccount, exchange, token1, user1;
  const feePercent = 10; //percent of fees that will be charged and is initialized as constant as it will be fixed

  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");

    //deploying token twice to perform exchange between the 2
    token1 = await Token.deploy("Barfi", "BRF", 1000000);

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];

    let transaction = await token1
      .connect(deployer)
      .transfer(user1.address, tokens(100)); //giveing tokens to user so that they can deposit on exchange before exchanging
    await transaction.wait();

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

  describe("Depositing Tokens", () => {
    let transaction, result;
    let amount = tokens(10); //user was transferred 100 tokens and he can deposit <= 100 tokens in exchange so we deposit 10 here

    describe("Success", () => {
      beforeEach(async () => {
        //Approve token
        transaction = await token1
          .connect(user1)
          .approve(exchange.address, amount);
        result = await transaction.wait();
        //Deposit token
        transaction = await exchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();
      });

      it("tracks the token deposit", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(amount);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          amount
        );
        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(amount);
      });
      it("emits a Deposit event", async () => {
        const event = result.events[1]; //since 2 event are emitted we need 2nd (we can check events emited by: console.log(event);)
        expect(event.event).to.equal("Deposit");
        const args = event.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("fails when no tokens are approved", async () => {
        await expect(
          exchange.connect(user1).depositToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });
});
