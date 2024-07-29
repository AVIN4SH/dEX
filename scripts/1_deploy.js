const { ethers } = require("hardhat");

async function main() {
  console.log("\nPreparing Deployment... \n");

  //fetching contract
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  //fetching accounts
  const accounts = await ethers.getSigners();

  console.log(
    `Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`
  );

  //deploying contract
  const BRF = await Token.deploy("Barfi", "BRF", 1000000);
  await BRF.deployed();
  console.log(`BRF Deployed to: ${BRF.address}`);

  const mETH = await Token.deploy("Mock ETH", "mETH", 1000000);
  await mETH.deployed();
  console.log(`mETH Deployed to: ${mETH.address}`);

  const mDAI = await Token.deploy("Mock DAI", "mDAI", 1000000);
  await mDAI.deployed();
  console.log(`mDAI Deployed to: ${mDAI.address}\n`);

  const exchange = await Exchange.deploy(accounts[1].address, 10);
  await exchange.deployed();
  console.log(`Exchange Deployed to: ${exchange.address}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode(1);
  });
