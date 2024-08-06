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
