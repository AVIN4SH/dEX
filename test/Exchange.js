const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (number) => {
  return ethers.utils.parseUnits(number.toString(), "ether");
};

describe("Exchange", () => {
  let deployer, feeAccount, exchange, token1, user1, token2;
  const feePercent = 10; //percent of fees that will be charged and is initialized as constant as it will be fixed

  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");

    //deploying token twice to perform exchange between the 2
    token1 = await Token.deploy("Barfi", "BRF", 1000000);
    token2 = await Token.deploy("Mock Dai", "mDai", 1000000);

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

  //! failure block in test case works fine and reverts transaction as we are not emitting any event in failure block whereas we are in success blocks, beforeEach part, so as the failure block does not emit any event it fails and since we used revert transaction, the test case passes.

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

  describe("Withdrawing Tokens", () => {
    let transaction, result;
    let amount = tokens(10); //user was transferred 100 tokens and he can deposit <= 100 tokens in exchange so we deposit 10 here

    describe("Success", () => {
      beforeEach(async () => {
        //! before withdrawing we need to deposit tokens(below code is for that)

        //*Deposit Tokens:
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

        //*Withdraw Tokens now:
        transaction = await exchange
          .connect(user1)
          .withdrawToken(token1.address, amount);
        result = await transaction.wait();
      });

      //!we check everywhere as 0 instead of amount as now withdraw done, so amount should be 0

      it("withdraws token funds", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(0);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          0
        );
        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(0);
      });
      it("emits a Withdraw event", async () => {
        const event = result.events[1]; //since 2 event are emitted we need 2nd (we can check events emited by: console.log(event);)
        expect(event.event).to.equal("Withdraw");
        const args = event.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(0);
      });
    });

    describe("Failure", () => {
      it("fails for insufficient balance", async () => {
        //attempt to withdraw tokens without depositing
        await expect(
          exchange.connect(user1).withdrawToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Checking Balances", () => {
    let transaction, result;
    let amount = tokens(1); //we set this 1 so that while checking balance we get a value

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

    it("returns user balance", async () => {
      expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(
        amount
      );
    });
  });

  describe("Making Orders", async () => {
    let transaction, result;
    let amount = tokens(1); //amount of tokens we deposit, approve & make orders for

    describe("Success", () => {
      beforeEach(async () => {
        //before making each order, first we make user deposit & approve tokens
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

        //making order:
        transaction = await exchange
          .connect(user1)
          .makeOrder(token2.address, amount, token1.address, amount); //here we make order for getting 1 mDai by giving 1 BRF
        result = await transaction.wait();
      });

      it("tracks the newly created order", async () => {
        expect(await exchange.orderCount()).to.equal(1);
      });

      it("emits a Order event", async () => {
        const event = result.events[0]; //we emitted 3 events and making order was 3rd so we specify 3rd index here
        expect(event.event).to.equal("Order");

        const args = event.args;
        expect(args.id).to.equal(1);
        expect(args.user).to.equal(user1.address);
        expect(args.tokenGet).to.equal(token2.address);
        expect(args.amountGet).to.equal(tokens(1));
        expect(args.tokenGive).to.equal(token1.address);
        expect(args.amountGive).to.equal(tokens(1));
        expect(args.timestamp).to.at.least(1); //we do normal check that timestamp exists as its very complex to check time of order make on blockchain
      });
    });

    describe("Failure", () => {
      it("rejects with no balance", async () => {
        await expect(
          exchange
            .connect(user1)
            .makeOrder(token2.address, tokens(1), token1.address, tokens(1))
        ).to.be.reverted;
      });
    });
  });
});
