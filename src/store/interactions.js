import { ethers } from "ethers";
import { providerLoaded, networkLoaded, accountLoaded } from "./provirderSlice";
import { tokenLoaded } from "./tokenSlice";
import TOKEN_ABI from "../abis/Token.json";

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

export const loadAccount = async (dispatch) => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    dispatch(accountLoaded({ account }));
    return account;
  } catch (error) {
    console.error("Failed to load account:", error);
  }
};

export const loadToken = async (provider, address, dispatch) => {
  try {
    const token = new ethers.Contract(address, TOKEN_ABI, provider);
    const symbol = await token.symbol();
    dispatch(tokenLoaded({ token, symbol }));
    return token;
  } catch (error) {
    console.error("Failed to load token:", error);
  }
};
