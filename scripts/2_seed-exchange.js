const { ethers } = require("hardhat");

const addressConfig = require("../utils/addressConfig.json");

const tokens = (number) => {
  return ethers.utils.parseUnits(number.toString(), "ether");
};

//we make 3-4 orders here so that when we start our application, we dont get empty screen, we start with a few orders.

const wait = (seconds) => {
  //this is to wait for certain amount of seconds before executing further (will be used below)
  const miliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

async function main() {
  // * - Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners();

  // * - Fetch network (using id)
  const { chainId } = await ethers.provider.getNetwork();
  console.log(`Using Chain id: ${chainId}`);

  // * - Fetching deployed tokens
  const BRF = await ethers.getContractAt(
    "Token",
    addressConfig[chainId].BRF.address
  );
  console.log(`\nBRF Token fetched: ${BRF.address}`);

  const mETH = await ethers.getContractAt(
    "Token",
    addressConfig[chainId].mETH.address
  );
  console.log(`mETH Token fetched: ${mETH.address}`);

  const mDAI = await ethers.getContractAt(
    "Token",
    addressConfig[chainId].mDAI.address
  );
  console.log(`mDAI Token fetched: ${mDAI.address}\n`);

  // * - Fetching the deployed exchange
  const exchange = await ethers.getContractAt(
    "Exchange",
    addressConfig[chainId].exchange.address
  );
  console.log(`Exchange fetched: ${exchange.address}\n`);

  // * - Distributing Tokens
  const sender = accounts[0]; //by default deployer has all the tokens & 1st account is deployer so we declare him as sender
  const receiver = accounts[1];
  let amount = tokens(10000);
  // giving tokens to accounts[1]
  let transaction, result;
  transaction = await mETH.connect(sender).transfer(receiver.address, amount); //sending 10000 mETH to reciever
  await transaction.wait();
  console.log(
    `Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`
  );

  // * - Set up exchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000);

  // * - user1 approves 10000 BRF...
  transaction = await BRF.connect(user1).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}`);
  // * - user1 deposits 10000 BRF...
  transaction = await exchange.connect(user1).depositToken(BRF.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} BRF tokens from ${user1.address}\n`);

  // * - user2 approves 10000 mETH...
  transaction = await mETH.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}`);
  // * - user2 deposits 10000 mETH...
  transaction = await exchange
    .connect(user2)
    .depositToken(mETH.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} mETH tokens from ${user2.address}\n`);

  // * - Make Orders
  // user1 makes an order to get 100 mETH tokens and give 5 BRF tokens
  let orderId;
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), BRF.address, tokens(5));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // * - Cancel Orders
  // user1 cancels the order
  orderId = result.events[0].args.id; //(we can see avaliable args using: console.log(result))
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Cancelled order from ${user1.address}\n`);

  //wait 1 second: (using our user defined function at top)
  await wait(1);

  // * - Fill Orders
  // to fill we make order again as 1st order was cancelled - user1 makes an order to get 100 mETH tokens and give 10 BRF tokens
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), BRF.address, tokens(10));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);
  // user 2 fills the order:
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  //wait 1 second again
  await wait(1);

  // * - making & filling another order
  // user 1 makes another to get 50 mETH tokens and give 15 BRF tokens
  transaction = await exchange.makeOrder(
    mETH.address,
    tokens(50),
    BRF.address,
    tokens(15)
  );
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);
  // user 2 fills this order:
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  //wait 1 second again
  await wait(1);

  // * - making & filling another order
  // user 1 makes another to get 200 mETH tokens and give 20 BRF tokens
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(200), BRF.address, tokens(20));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);
  // user 2 fills this order:
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  //wait 1 second again
  await wait(1);

  // * - Seed open orders
  // we make 10-10 orders from both users side (so we can have a orderbook at beginning of launch of application)
  //user1 makes 10 orders (get mETH of (i x 10) amount and give 10 BRF)
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user1)
      .makeOrder(mETH.address, tokens(i * 10), BRF.address, tokens(10));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}`);

    //wait 1 second again
    await wait(1);
  }
  console.log("\n");
  //user2 makes 10 orders  (get 10 BRF and give (i x 10) mETH)
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user2)
      .makeOrder(BRF.address, tokens(10), mETH.address, tokens(i * 10));
    result = await transaction.wait();
    console.log(`Made order from ${user2.address}`);

    //wait 1 second again
    await wait(1);
  }
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode(1);
  });
