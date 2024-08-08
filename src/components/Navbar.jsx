import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import eth from "../assets/eth.svg";
import Blockies from "react-blockies";
import { loadAccount } from "../store/interactions";
import config from "../../utils/addressConfig.json";

const Navbar = () => {
  const dispatch = useDispatch();

  const provider = useSelector((state) => state.provider.connection);
  const chainId = useSelector((state) => state.provider.chainId);
  const account = useSelector((state) => state.provider.account);
  const balance = useSelector((state) => state.provider.balance);

  const connectHandler = async () => {
    // Load Account
    // fetching current account & balance from metamask
    await loadAccount(provider, dispatch);
  };

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: e.target.value }],
    });
  };

  return (
    <div className="exchange__header grid">
      <div className="exchange__header--brand flex">
        <img src={logo} alt="logo" className="logo" />
        <h1>BRF dEX</h1>
      </div>

      <div className="exchange__header--networks flex">
        <img
          src={eth}
          alt="eth logo"
          className="Eth Logo"
          height={30}
          width={30}
        />
        &nbsp;
        {chainId && (
          <select
            name="networks"
            id="networks"
            onChange={networkHandler}
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
          >
            <option value="" disabled>
              Select Network
            </option>
            <option value="0x7A69">Localhost (Hardhat)</option>
            {/* <option value="0x2a">Kovan</option> */}
            {/* Test network link not connecting and error 4902 occuring when this is selected */}
          </select>
        )}
      </div>

      <div className="exchange__header--account flex">
        {balance ? (
          <p>
            <small>My Balance:</small>
            {Number(balance).toFixed(4)} ETH
          </p>
        ) : (
          <p>
            <small>My Balance</small>0 ETH
          </p>
        )}
        {account ? (
          <a
            href={
              config[chainId] && "/#"
              /* 
              * use below code when deploying to a testnet (as currently hardhat so default will be "#")
              config[chainId]
                ? `${config[chainId].explorerURL}/address/${account}`
                : "#"
              */
            }
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon"
            />
          </a>
        ) : (
          <button className="button" onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
