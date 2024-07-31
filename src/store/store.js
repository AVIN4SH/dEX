import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import providerReducer from "./provirderSlice";
import tokenReducer from "./tokenSlice";

const store = configureStore({
  reducer: {
    provider: providerReducer,
    token: tokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /*
        To remove warning that appears because Redux Toolkit includes checks to ensure that all actions and state are serializable by default. Web3Provider objects from ethers.js are not serializable, and that's why this warning occurs.
        */
      serializableCheck: {
        ignoredActions: [
          "provider/providerLoaded",
          "provider/networkLoaded",
          "provider/accountLoaded",
          "token/tokenLoaded",
        ],
        ignoredPaths: [
          "provider.connection",
          "provider.account",
          "token.contract",
        ],
      },
    }).concat(thunk),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
