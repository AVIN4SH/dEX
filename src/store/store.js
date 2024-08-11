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
          "exchange/transferSuccess",
          "exchange/transferFail",
          "exchange/newOrderSuccess",
          "exchange/newOrderFail",
          "exchange/allOrdersLoaded",
          "exchange/cancelledOrdersLoaded",
          "exchange/filledOrdersLoaded",
          "exchange/orderCancelRequest",
          "exchange/orderCancelSuccess",
          "exchange/orderCancelFail",
        ],
        ignoredPaths: [
          "provider.connection",
          "provider.account",
          "provider.balance",
          "tokens.contracts",
          "exchange.contract",
          "exchange.events",
          "exchange.allOrders.data",
          "exchange.cancelledOrders.data",
          "exchange.filledOrders.data",
        ],
      },
    }).concat(thunk),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
