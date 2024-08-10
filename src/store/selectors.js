import { createSelector } from "reselect";
import { get, groupBy, reject } from "lodash";
import { ethers } from "ethers";
import moment from "moment"; // this is a library we will use to format time (blockchain timestamp)

// color values which we will store as: green for buy orders & red for sell orders
const GREEN = "#25CE8F";
const RED = "#F45353";

const tokens = (state) => get(state, "tokens.contracts");
const account = (state) => get(state, "provider.account");
const allOrders = (state) => get(state, "exchange.allOrders.data", []);
const cancelledOrders = (state) =>
  get(state, "exchange.cancelledOrders.data", []);
const filledOrders = (state) => get(state, "exchange.filledOrders.data", []);

// getting open orders from store to display in book:
const openOrders = (state) => {
  const all = allOrders(state);
  const filled = filledOrders(state);
  const cancelled = cancelledOrders(state);
  // now using lodash library's reject method we filter out and store only open orders that we will display in book
  const openOrders = reject(all, (order) => {
    const orderFilled = filled.some(
      (o) => o.id.toString() === order.id.toString()
    );
    const orderCancelled = cancelled.some(
      (o) => o.id.toString() === order.id.toString()
    );
    return orderFilled || orderCancelled;
    //! this rejects i.e; removes filled & canclled orders so that we only show open orders in book
  });
  return openOrders;
};

// Below selector is for getting my open orders to display the users orders only in ui
export const myOpenOrdersSelector = createSelector(
  account,
  tokens,
  openOrders,
  (account, tokens, orders) => {
    if (!tokens[0] || !tokens[1]) {
      return;
    } else {
      // Filter orders created by current account:
      orders = orders.filter((o) => o.user === account);
      // Filter orders by token address:
      orders = orders.filter(
        (o) =>
          (o.tokenGet === tokens[0].address ||
            o.tokenGet === tokens[1].address) &&
          (o.tokenGive === tokens[0].address ||
            o.tokenGive === tokens[1].address)
      );
      // decorating myOpenOrders: (adding dispay attributes)
      orders = decorateMyOpenOrders(orders, tokens);
      // Sort orders by date descending (so that we see latest on top)
      orders = orders.sort((a, b) => b.timestamp - a.timestamp);
      // console.log(orders);
      return orders;
    }
  }
);

// below is for decorating myOpenOrder:
const decorateMyOpenOrders = (orders, tokens) => {
  return orders.map((order) => {
    order = decorateOrder(order, tokens); // this is basic decorator that adds token amounts, formatted time stamp, etc
    order = decorateMyOpenOrder(order, tokens); // this is custom decorator for myOpenOrder only
    return order;
  });
};

// below is to decorate each individual order in myOpenOrder: (this is used in above wrapper)
const decorateMyOpenOrder = (order, tokens) => {
  let orderType = order.tokenGive === tokens[1].address ? "buy" : "sell";
  return {
    ...order,
    orderType,
    orderTypeClass: orderType === "buy" ? GREEN : RED, // adding green to buy orders & red to sell orders
  };
};

// below method is to add certain key value pairs to each order that will help us display order informatiuon in good format
const decorateOrder = (order, tokens) => {
  let token0Amount, token1Amount;

  // NOTE: BRF is considered token0, mETH/mDAI is token1
  if (order.tokenGive === tokens[1].address) {
    token0Amount = order.amountGive; // amount of BRF we are giving
    token1Amount = order.amountGet; // amount of mETH/mDAI we want
  } else {
    token0Amount = order.amountGet; // amount of BRF we want
    token1Amount = order.amountGive; // amount of mETH/mDAI we are giving
  }

  // Calculating token price to 5 decimal places
  const precision = 100000;
  let tokenPrice = token1Amount / token0Amount;
  tokenPrice = Math.round(tokenPrice * precision) / precision;

  // we append below mentioned key value pair to each order array
  return {
    ...order,
    token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
    token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
    tokenPrice: tokenPrice,
    formattedTimstamp: moment.unix(order.timestamp).format("h:mm:ssa d MMM D"), // here we use moment library (from npm package) to format the blockchain timestamp in desired format
  };
};

// below method is specifically for adding certain info to each order array based on whether its a buy order or sell order for orderbook
const decorateOrderBookOrder = (order, tokens) => {
  const orderType = order.tokenGive === tokens[1].address ? "buy" : "sell";

  return {
    ...order,
    orderType: orderType,
    orderTypeClass: orderType === "buy" ? GREEN : RED, // adding green hex code to buy orders & red hex code to sell orders
    orderFillAction: orderType === "buy" ? "sell" : "buy", // setting order action to buy for sell order & sell for buy order
  };
};

// below method is justr for wrapping above 2 methods inside 1 so that we can use in main selector
const decorateOrderBookOrders = (orders, tokens) => {
  return orders.map((order) => {
    order = decorateOrder(order, tokens);
    order = decorateOrderBookOrder(order, tokens);
    return order;
  });
};

// below method is to decorate filled orders (to be shown in trade section)
const decorateFilledOrders = (orders, tokens) => {
  // tracking previous order to compare history
  let previousOrder = orders[0]; // we update inside map and 1st time previous will be [0] index

  return orders.map((order) => {
    // decorate each individual order
    order = decorateOrder(order, tokens); //this adds price so that we can compare to previous and add color accordingly
    order = decorateFilledOrder(order, previousOrder);
    previousOrder = order; //updating previousOrder once its decorated
    return order;
  });
};

// below method will be using inside above wrapper function and will decorate each filled order:
const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder),
    // tokenPriceClass: order.tokenPrice >= previousOrder.tokenPrice ? GREEN : RED,
  };
};

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
  // showing green price if only one order exists
  if (previousOrder.id === orderId) {
    return GREEN;
  }
  // showing green price if order price is higher than previous order
  // show red price if order price lower than previous order
  if (previousOrder.tokenPrice <= tokenPrice) {
    return GREEN; // success
  } else {
    return RED; // danger
  }
};

// --------------------------------------------------
// Calculate all filled orders (for trades section)
export const filledOrdersSeclector = createSelector(
  filledOrders,
  tokens,
  (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) {
      return; // this is for when no tokens, so we return from function
    }
    // * - Filter orders by selected tokens:
    orders = orders.filter(
      (o) =>
        (o.tokenGet === tokens[0].address ||
          o.tokenGet === tokens[1].address) &&
        (o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
    );

    // Step 1: sort orders by ascending time
    // Step 2: apply order colors(decorate)
    // Step 3: sort orders by descending time for UI

    // Step 1: sort orders by time ascending for price comparision
    orders = orders.sort((a, b) => a.timestamp - b.timestamp);
    // Step 2: apply order colors(decorate)
    orders = decorateFilledOrders(orders, tokens);
    // Step 3: sort orders by date descending time for UI
    orders = orders.sort((a, b) => b.timestamp - a.timestamp);
    // console.log(orders);
    return orders;
  }
);

// --------------------------------------------------
// Selector to get data for orderbook
export const orderBookSelector = createSelector(
  openOrders,
  tokens,
  (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) {
      return; // this is for when no tokens, so we return from function
    }
    // * - Filter orders by selected tokens:
    orders = orders.filter(
      (o) =>
        (o.tokenGet === tokens[0].address ||
          o.tokenGet === tokens[1].address) &&
        (o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
    );
    // * - Decorate orders:
    orders = decorateOrderBookOrders(orders, tokens);
    // * - Grouping orders by ordertype i.e; 1 object for buy orders & 1 for sell orders
    orders = groupBy(orders, "orderType"); // here we groupBy a orderType key which we added to array using one of decorator function
    // above method from lodash library returns an object that contains 2 objects containing orders which are grouped by dpecified criteria
    // * - Sorting buy orders by token price
    // fetch buy orders:
    const buyOrders = get(orders, "buy", []); // this returns all buy orders or an empty array if no buy orders exist from orders
    // sorting:
    orders = {
      ...orders,
      buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice), // this sorts from highest to lowest price
    };
    // * - Sorting sell orders by token price
    // fetch sell orders:
    const sellOrders = get(orders, "sell", []);
    // sorting:
    orders = {
      ...orders,
      sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
    };
    return orders;
  }
);
