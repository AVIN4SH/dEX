require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {},
    //we can explicitly provide url of hardhat node here, but we don't need to as when we use empty paranthesis, it takes default value i.e; the hardhat node
  },
};
