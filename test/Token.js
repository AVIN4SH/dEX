const { expect } = require("chai");
const { ethers } = require("hardhat");

/*
Steps to be followed in each it block of describe:
    1.Fetch token from blockchain
    2.Read Token Name
    3.Check for the concerned value
*/

const tokens = (number) => {
  return ethers.utils.parseUnits(number.toString(), "ether");
};

describe("Token", () => {
  let token; //making token a state variable so that it is accissible throughout the describe block, & we assign value inside below beforeEach hook
  let accounts; //to store accounts that are in our blockchain(here the 20 hardhat accounts) we initialize it in beforeEach block
  let deployer; //to store deployer of contract (i.e; here the 1st account of hardhat is deployer by default)
  let receiver; //to store an account that will receive the transefered tokens

  beforeEach(async () => {
    //!this is code that gets executed before each of it blocks
    //(we can write the repeated code here, thus reducing redundancy and make code cleaner)
    const Token = await ethers.getContractFactory("Token"); //this is just getting the contract
    token = await Token.deploy("Barfi", "BRF", 1000000); //this is getting an instance of the deployed contract
    //above method calls constructor of contract, so we pass in values here
    accounts = await ethers.getSigners(); //getting all the accounts that are in our blockchain (i.e; here the 20 accounts hardhat provides) (this returns an array)
    deployer = accounts[0]; //this will store object form of deployer account with address as one of its attributes
    receiver = accounts[1]; //this account will recieve tokens that are transfered
  });

  describe("Deployment", () => {
    const name = "Barfi";
    const symbol = "BRF";
    const decimals = 18;
    const totalSupply = tokens("1000000");

    it("has correct name", async () => {
      //!checks if name is correct:
      expect(await token.name()).to.equal(name);
      /*
        we can combine below 2 lines and use above:
            const name = await token.name();
            expect(name).to.equal("Barfi");
    */
    });

    //above we have notes for explnanation and below are standard uses of it:

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct total supply", async () => {
      // const value = ethers.utils.parseUnits("1000000", "ether");
      //here instead oof checking with 1000000000000000000000000, we use a ethers utlity and pass in ether value of our supply that was 1 milion and parse to ether that has 18 decimal places
      //that is, above statement converts 1 million barfi to wei value as our total suppy is also in wei

      //above is old way: we can dynamically get token supply using our user defined function on top and using it below as:
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("assigns total supply of tokens to deployer", async () => {
      expect(await token.balanceOf(deployer?.address)).to.equal(totalSupply);
    });
  });

  describe("Sending Tokens", () => {
    let amount, transaction, result; //we declare it in this scope as we need it multiple times

    describe("Success in Transfer", () => {
      beforeEach(async () => {
        amount = tokens("100"); //100 tokens(we used our tokens method to convert to wei value)
        //first we need yo connect to connect wallet and tranfer is updating the blockchain & we need to pay gas fees for that
        transaction = await token
          .connect(deployer)
          .transfer(receiver?.address, amount); //this statement takes the deployer wallet & connects it to token smart contract & transferes tokens
        result = await transaction.wait(); //this ensures that we wait for entire transaction to finish & get added to block
      });

      it("transfers token balance", async () => {
        // we can log the balance of deployer(sender) and receiver before and after transaction using this statement once here with deployer.address and once with receiver.address before and after the expect statement:
        // console.log(`Balance of Deployer before Transfer: ${ethers.utils.formatUnits(await token.balanceOf(deployer?.address),18)}`);

        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(999900)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("emits a Transfer event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure in Transfer", () => {
      it("rejects due to insufficient balance", async () => {
        //transfer more token that deployer(sender) has
        const invalidAmount = tokens(100000000); //deployer only has 1 million tokens whereas here we try to send 100 million to test for insufficient balance case
        await expect(
          token.connect(deployer).transfer(receiver?.address, invalidAmount)
        ).to.be.reverted; //using waffle we throgh error message and revert the transaction due to insufficient balance
      });

      it("rejects due to invalid recipient", async () => {
        const amount = tokens(100);
        await expect(
          token
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted; //using waffle we throgh error message and revert the transaction due to invalid receiver address
      });
    });
  });
});
