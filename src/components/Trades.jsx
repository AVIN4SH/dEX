import { useSelector } from "react-redux";
import { filledOrdersSeclector } from "../store/selectors";
import sortLogo from "../assets/sort.svg";
import Banner from "./Banner";

const Trades = () => {
  const filledOrders = useSelector(filledOrdersSeclector);
  const symbols = useSelector((state) => state.tokens.symbols);

  return (
    <div className="component exchange__trades">
      <div className="component__header flex-between">
        <h2>Trades</h2>
      </div>

      {!filledOrders || filledOrders.length === 0 ? (
        <Banner text={"No Transactions"} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Time <img src={sortLogo} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[0]}
                {/* Amount */}
                <img src={sortLogo} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[0]} / {symbols && symbols[1]}
                {/* Price */}
                <img src={sortLogo} alt="Sort" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping Filled Orders */}
            {filledOrders &&
              filledOrders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{order.formattedTimstamp}</td>
                    <td style={{ color: `${order.tokenPriceClass}` }}>
                      {order.token0Amount}
                    </td>
                    <td>{order.tokenPrice}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Trades;
