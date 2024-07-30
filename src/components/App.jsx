import { useEffect } from "react";
import { ethers } from "ethers";
import addressConfig from "../../utils/addressConfig.json";
import TOKEN_ABI from "../abis/Token.json";
import "../App.css";

/* 
Here in client side application we will use vanilla ethers i.e; normal ethers library as it is different from the one we imported as ethers from hardhat in deploy and test scripts as that one is from hardhat which we don't require here
*/

function App() {
  const loadBlockChainData = async () => {
    // * - connect to metamask wallet and get account:
    const accounts = await window.ethereum.request({
      //this makes RPC call to our node to get our account we are connect with
      method: "eth_requestAccounts",
    });
    console.log(accounts[0]);

    // * - interact with Token smart contract
    // Connecting ethers to Blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    console.log(chainId);
    // Token Smart Contract
    const token = new ethers.Contract(
      addressConfig[chainId].BRF.address,
      TOKEN_ABI,
      provider
    );
    //Now we can interact with Token contract and call in all avaiable functions
    console.log(token.address);
    console.log(await token.symbol());
  };

  useEffect(() => {
    loadBlockChainData();
  });

  return (
    <div>
      {/* Navbar */}
      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}
          {/* Balance */}
          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}
          {/* Transactions */}
          {/* Trades */}
          {/* OrderBook */}
        </section>
      </main>
      {/* Alert */}
    </div>
  );
}

export default App;
