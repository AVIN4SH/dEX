import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loadProvider,
  loadNetwork,
  loadTokens,
  loadExchange,
  loadAccount,
} from "../store/interactions";
import config from "../../utils/addressConfig.json";
import Navbar from "./Navbar";
import Markets from "./Markets";

function App() {
  const dispatch = useDispatch();

  const loadBlockChainData = async () => {
    try {
      // connecting ethers to blockchain
      const provider = await loadProvider(dispatch);
      // fetching current network's chainId (example:  hardhat: 31337)
      const chainId = await loadNetwork(provider, dispatch);
      // Reloading page when network changes:
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      // First time Account & balance fetch will be done from navBar's connect button (below is for when accoutn change so we reload page)
      // i.e; below is fetching current account & balance when metamask account change
      window.ethereum.on("accountsChanged", () => {
        loadAccount(provider, dispatch);
      });
      // loading token smart contract (here we load tokens in pair so we can provide market slection option on dEX
      // here we load this just for loading sake, main tokens will be loaded when user select market in Markets component
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
      <Navbar />
      <main className="exchange grid">
        <section className="exchange__section--left grid">
          <Markets />
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
