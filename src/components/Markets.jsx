import { useDispatch, useSelector } from "react-redux";
import config from "../../utils/addressConfig.json";
import { loadTokens } from "../store/interactions";

const Markets = () => {
  const chainId = useSelector((state) => state.provider.chainId);
  const provider = useSelector((state) => state.provider.connection);
  const dispatch = useDispatch();

  const marketHandler = async (e) => {
    await loadTokens(provider, e.target.value.split(","), dispatch);
  };

  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2 className="">Select Market</h2>
      </div>
      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option
            value={`${config[chainId].BRF.address},${config[chainId].mETH.address}`}
          >
            BRF / mETH
          </option>
          <option
            value={`${config[chainId].BRF.address},${config[chainId].mDAI.address}`}
          >
            BRF / mDAI
          </option>
        </select>
      ) : (
        <div>
          <p>Not Deployed to Network</p>
        </div>
      )}
      <hr />
    </div>
  );
};

export default Markets;
