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
  beforeEach(async () => {
    //!this is code that gets executed before each of it blocks
    //(we can write the repeated code here, thus reducing redundancy and make code cleaner)
    const Token = await ethers.getContractFactory("Token"); //this is just getting the contract
    token = await Token.deploy("Barfi", "BRF", 1000000); //this is getting an instance of the deployed contract
    //above method calls constructor of contract, so we pass in values here
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
  });
});
