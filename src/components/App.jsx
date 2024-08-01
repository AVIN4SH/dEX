import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
} from "../store/interactions";
import config from "../../utils/addressConfig.json";

function App() {
  const dispatch = useDispatch();

  const loadBlockChainData = async () => {
    try {
      // connecting ethers to blockchain
      const provider = await loadProvider(dispatch);
      // fetching current network's chainId (example:  hardhat: 31337)
      const chainId = await loadNetwork(provider, dispatch);
      // fetching current account & balance from metamask
      await loadAccount(provider, dispatch);
      // loading token smart contract (here we load tokens in pair so we can provide market slection option on dEX)
      const BRF = config[chainId].BRF;
      const mETH = config[chainId].mETH;
      await loadTokens(provider, [BRF.address, mETH.address], dispatch);
      // loading exchange smart contract
      const exchangeConfig = config[chainId].exchange;
      await loadExchange(provider, exchangeConfig.address, dispatch);
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
