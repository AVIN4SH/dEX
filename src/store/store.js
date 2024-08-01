import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import providerReducer from "./providerSlice";
import tokensReducer from "./tokensSlice";
import exchangeReducer from "./exchangeSlice";

const store = configureStore({
  reducer: {
    provider: providerReducer,
    tokens: tokensReducer,
    exchange: exchangeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    /*
      To remove warning that appears because Redux Toolkit includes checks to ensure that all actions and state are serializable by default. Web3Provider objects from ethers.js are not serializable, and that's why this warning occurs.
      */
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "provider/providerLoaded",
          "provider/networkLoaded",
          "provider/accountLoaded",
          "provider/etherBalanceLoaded",
          "tokens/token1Loaded",
          "tokens/token2Loaded",
          "exchange/exchangeLoaded",
        ],
        ignoredPaths: [
          "provider.connection",
          "provider.account",
          "provider.balance",
          "tokens.contracts",
          "exchange.contract",
        ],
      },
    }).concat(thunk),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
