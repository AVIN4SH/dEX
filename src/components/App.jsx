import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken,
} from "../store/interactions";
import config from "../../utils/addressConfig.json";

/* 
Here in client side application we will use vanilla ethers i.e; normal ethers library as it is different from the one we imported as ethers from hardhat in deploy and test scripts as that one is from hardhat which we don't require here
*/

function App() {
  const dispatch = useDispatch();

  const loadBlockChainData = async () => {
    try {
      await loadAccount(dispatch);
      const provider = await loadProvider(dispatch);
      const chainId = await loadNetwork(provider, dispatch);
      await loadToken(provider, config[chainId].BRF.address, dispatch);
    } catch (error) {
      console.error("Error initializing:", error);
    }
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
