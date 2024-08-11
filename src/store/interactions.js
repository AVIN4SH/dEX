import { ethers } from "ethers";
import {
  providerLoaded,
  networkLoaded,
  accountLoaded,
  etherBalanceLoaded,
} from "./providerSlice";
import {
  token1Loaded,
  token2Loaded,
  token1BalanceLoaded,
  token2BalanceLoaded,
} from "./tokensSlice";
import {
  exchangeLoaded,
  exchnageToken1BalanceLoaded,
  exchnageToken2BalanceLoaded,
  transferRequest,
  transferSuccess,
  transferFail,
  newOrderRequest,
  newOrderSuccess,
  newOrderFail,
  allOrdersLoaded,
  cancelledOrdersLoaded,
  filledOrdersLoaded,
  orderCancelRequest,
  orderCancelSuccess,
  orderCancelFail,
} from "./exchangeSlice";
import TOKEN_ABI from "../abis/Token.json";
import EXCHANGE_ABI from "../abis/Exchange.json";

export const loadProvider = async (dispatch) => {
  try {
    const connection = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(providerLoaded({ connection }));
    return connection;
  } catch (error) {
    console.error("Failed to load provider:", error);
  }
};

export const loadNetwork = async (provider, dispatch) => {
  try {
    const { chainId } = await provider.getNetwork();
    dispatch(networkLoaded({ chainId }));
    return chainId;
  } catch (error) {
    console.error("Failed to load network:", error);
  }
};

export const loadAccount = async (provider, dispatch) => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    dispatch(accountLoaded({ account }));

    let balance = await provider.getBalance(account);
    balance = ethers.utils.formatEther(balance);
    dispatch(etherBalanceLoaded({ balance }));

    return account;
  } catch (error) {
    console.error("Failed to load account:", error);
  }
};

export const loadTokens = async (provider, addresses, dispatch) => {
  try {
    let token, symbol;

    token = new ethers.Contract(addresses[0], TOKEN_ABI, provider);
    symbol = await token.symbol();
    dispatch(token1Loaded({ token, symbol }));

    token = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
    symbol = await token.symbol();
    dispatch(token2Loaded({ token, symbol }));

    return token;
  } catch (error) {
    console.error("Failed to load token:", error);
  }
};

export const loadExchange = async (provider, address, dispatch) => {
  try {
    let exchange;

    exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
    dispatch(exchangeLoaded({ exchange }));

    return exchange;
  } catch (error) {
    console.error("Failed to load exchange:", error);
  }
};

export const subscribeToEvents = async (exchange, dispatch) => {
  exchange.on("Deposit", (token, user, amount, balance, event) => {
    // Notify app that transfer (deposit) was successful
    dispatch(transferSuccess({ event }));
  });

  exchange.on("Withdraw", (token, user, amount, balance, event) => {
    // Notify app that transfer (withdraw) was successful
    dispatch(transferSuccess({ event }));
  });

  exchange.on(
    "Order",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      timestamp,
      event
    ) => {
      const order = event.args;
      dispatch(newOrderSuccess({ order, event }));
    }
  );

  exchange.on(
    "Cancel",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      timestamp,
      event
    ) => {
      // Notify app that cancel (withdraw) was successful
      const order = event.args;
      dispatch(orderCancelSuccess({ order, event }));
    }
  );
};

// Load User Balances (Wallet & Exchange Balances)
export const loadBalances = async (exchange, tokens, account, dispatch) => {
  try {
    let balance;
    // token 1 balance with user
    balance = ethers.utils.formatUnits(await tokens[0].balanceOf(account), 18);
    dispatch(token1BalanceLoaded({ balance }));
    // token 1 balance on exchange
    balance = ethers.utils.formatUnits(
      await exchange.balanceOf(tokens[0].address, account),
      18
    );
    dispatch(exchnageToken1BalanceLoaded({ balance }));
    // token 2 balance with user
    balance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), 18);
    dispatch(token2BalanceLoaded({ balance }));
    // token 2 balance on exchange
    balance = ethers.utils.formatUnits(
      await exchange.balanceOf(tokens[1].address, account),
      18
    );
    dispatch(exchnageToken2BalanceLoaded({ balance }));
  } catch (error) {
    console.error("Failed to load Balances:", error);
  }
};

// Load all orders (cancelled, filled & all)
export const loadAllOrders = async (provider, exchange, dispatch) => {
  const block = await provider.getBlockNumber();

  // Fetch all cancelled orders:
  const cancelStream = await exchange.queryFilter("Cancel", 0, block);
  const cancelledOrders = cancelStream.map((event) => event.args);
  dispatch(cancelledOrdersLoaded({ cancelledOrders }));

  // Fetch filled orders:
  const tradeStream = await exchange.queryFilter("Trade", 0, block);
  const filledOrders = tradeStream.map((event) => event.args);
  dispatch(filledOrdersLoaded({ filledOrders }));

  // Fetch all orders:
  const orderStream = await exchange.queryFilter("Order", 0, block);
  const allOrders = orderStream.map((event) => event.args);
  dispatch(allOrdersLoaded({ allOrders }));
};

// Transfer Tokens (Deposit & Withdraw)
export const transferTokens = async (
  provider,
  exchange,
  transferType,
  token,
  amount,
  dispatch
) => {
  try {
    let transaction;
    dispatch(transferRequest());
    const signer = await provider.getSigner();
    const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

    if (transferType === "Deposit") {
      // for deposit
      transaction = await token
        .connect(signer)
        .approve(exchange.address, amountToTransfer);
      await transaction.wait();
      transaction = await exchange
        .connect(signer)
        .depositToken(token.address, amountToTransfer);
      await transaction.wait();
    } else {
      // for withdraw
      transaction = await exchange
        .connect(signer)
        .withdrawToken(token.address, amountToTransfer);
      await transaction.wait();
    }
  } catch (error) {
    dispatch(transferFail());
  }
};

// Orders (Buy & Sell)
export const makeBuyOrder = async (
  provider,
  exchange,
  tokens,
  order,
  dispatch
) => {
  const tokenGet = tokens[0].address;
  const amountGet = ethers.utils.parseUnits(order.amount, 18);
  const tokenGive = tokens[1].address;
  const amountGive = ethers.utils.parseUnits(
    (order.amount * order.price).toString(),
    18
  ); // amount give = order's amount  x order's price

  dispatch(newOrderRequest());
  try {
    const signer = await provider.getSigner();
    const transaction = await exchange
      .connect(signer)
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch(newOrderFail());
  }
};
// below we will reverse all that was in buy as now sell
export const makeSellOrder = async (
  provider,
  exchange,
  tokens,
  order,
  dispatch
) => {
  const tokenGet = tokens[1].address;
  const amountGet = ethers.utils.parseUnits(
    (order.amount * order.price).toString(),
    18
  );
  const tokenGive = tokens[0].address;
  const amountGive = ethers.utils.parseUnits(order.amount, 18); // amount give = order's amount  x order's price

  dispatch(newOrderRequest());
  try {
    const signer = await provider.getSigner();
    const transaction = await exchange
      .connect(signer)
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch(newOrderFail());
  }
};

// Cancel Orders:
export const cancelOrder = async (provider, exchange, order, dispatch) => {
  dispatch(orderCancelRequest());
  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).cancelOrder(order.id);
    await transaction.wait();
  } catch (error) {
    dispatch(orderCancelFail());
  }
};
