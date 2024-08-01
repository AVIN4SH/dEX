import { ethers } from "ethers";
import {
  providerLoaded,
  networkLoaded,
  accountLoaded,
  etherBalanceLoaded,
} from "./providerSlice";
import { token1Loaded, token2Loaded } from "./tokensSlice";
import { exchangeLoaded } from "./exchangeSlice";
import TOKEN_ABI from "../abis/Token.json";
import EXCHANGE_ABI from "../abis/Token.json";

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
