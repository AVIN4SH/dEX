import { useDispatch, useSelector } from "react-redux";
import {
  myFilledOrdersSelector,
  myOpenOrdersSelector,
} from "../store/selectors";
import sortLogo from "../assets/sort.svg";
import Banner from "./Banner";
import { useRef, useState } from "react";
import { cancelOrder } from "../store/interactions";

const Transactions = () => {
  const myOpenOrders = useSelector(myOpenOrdersSelector);
  const myFiledOrders = useSelector(myFilledOrdersSelector);

  const dispatch = useDispatch();
  const exchange = useSelector((state) => state.exchange.contract);
  const provider = useSelector((state) => state.provider.connection);
  const symbols = useSelector((state) => state.tokens.symbols);

  const [isOrder, setIsOrder] = useState(true);

  const orderRed = useRef(null);
  const tradeRef = useRef(null);

  const tabHandler = (e) => {
    if (e.target.className !== orderRed.current.className) {
      e.target.className = "tab tab--active";
      orderRed.current.className = "tab";
      setIsOrder(false);
    } else {
      e.target.className = "tab tab--active";
      tradeRef.current.className = "tab";
      setIsOrder(true);
    }
  };

  const cancelHandler = (order) => {
    cancelOrder(provider, exchange, order, dispatch);
  };

  return (
    <div className="component exchange__transactions">
      {isOrder ? (
        <div>
          <div className="component__header flex-between">
            <h2>My Orders</h2>

            <div className="tabs">
              <button
                onClick={tabHandler}
                ref={orderRed}
                className="tab tab--active"
              >
                Orders
              </button>
              <button onClick={tabHandler} ref={tradeRef} className="tab">
                Trades
              </button>
            </div>
          </div>

          {!myOpenOrders || myOpenOrders.length === 0 ? (
            <Banner text={"No Open Orders"} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    {symbols && symbols[0]} <img src={sortLogo} alt="Sort" />
                  </th>
                  <th>
                    {symbols && symbols[0]} / {symbols && symbols[1]}
                    <img src={sortLogo} alt="Sort" />
                  </th>
                  <th>Cancel Orders</th>
                </tr>
              </thead>
              <tbody>
                {myOpenOrders &&
                  myOpenOrders.map((order, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ color: `${order.orderTypeClass}` }}>
                          {order.token0Amount}
                        </td>
                        <td>{order.tokenPrice}</td>
                        <td>
                          <button
                            onClick={() => cancelHandler(order)}
                            className="button--sm"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          <div className="component__header flex-between">
            <h2>My Transactions</h2>

            <div className="tabs">
              <button onClick={tabHandler} ref={orderRed} className="tab">
                Orders
              </button>
              <button
                onClick={tabHandler}
                ref={tradeRef}
                className="tab tab--active"
              >
                Trades
              </button>
            </div>
          </div>

          {!myFiledOrders || myFiledOrders.length === 0 ? (
            <Banner text={"No Filled Orders"} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    Time <img src={sortLogo} alt="Sort" />
                  </th>
                  <th>
                    {symbols && symbols[0]} <img src={sortLogo} alt="Sort" />
                  </th>
                  <th>
                    {symbols && symbols[0]} / {symbols && symbols[1]}
                    <img src={sortLogo} alt="Sort" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {myFiledOrders &&
                  myFiledOrders.map((order, index) => {
                    return (
                      <tr key={index}>
                        <td>{order.formattedTimstamp}</td>
                        <td style={{ color: `${order.orderClass}` }}>
                          {order.orderSign}
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
      )}
    </div>
  );
};

export default Transactions;
