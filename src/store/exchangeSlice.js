import { createSlice } from "@reduxjs/toolkit";

const exchangeSlice = createSlice({
  name: "exchange",
  initialState: {
    loaded: false,
    contract: {},
    balances: [],
    transaction: {
      transactionType: "",
      isPending: false,
      isSuccessful: false,
      isError: false,
    },
    transferInProgress: false,
    events: [],
    allOrders: {
      loaded: false,
      data: [],
    },
    cancelledOrders: {
      loaded: false,
      data: [],
    },
    filledOrders: {
      loaded: false,
      data: [],
    },
  },
  reducers: {
    exchangeLoaded: (state, action) => {
      state.loaded = true;
      state.contract = action.payload.exchange;
    },
    // orders loaded: (cancelled, filled & all)
    allOrdersLoaded: (state, action) => {
      state.allOrders = {
        loaded: true,
        data: action.payload.allOrders,
      };
    },
    cancelledOrdersLoaded: (state, action) => {
      state.cancelledOrders = {
        loaded: true,
        data: action.payload.cancelledOrders,
      };
    },
    filledOrdersLoaded: (state, action) => {
      state.filledOrders = {
        loaded: true,
        data: action.payload.filledOrders,
      };
    },
    exchnageToken1BalanceLoaded: (state, action) => {
      state.balances[0] = action.payload.balance;
    },
    exchnageToken2BalanceLoaded: (state, action) => {
      state.balances[1] = action.payload.balance;
    },
    // tracking transfer cases (deposit & withdraw)
    // eslint-disable-next-line no-unused-vars
    transferRequest: (state, action) => {
      state.transaction = {
        ...state.transaction,
        transactionType: "Transfer",
        isPending: true,
        isSuccessful: false,
        isError: false,
      };
      state.transferInProgress = true;
    },
    transferSuccess: (state, action) => {
      state.transaction = {
        transactionType: "Transfer",
        isPending: false,
        isSuccessful: true,
        isError: false,
      };
      state.transferInProgress = false;
      state.events = [action.payload.event, ...state.events];
    },
    // eslint-disable-next-line no-unused-vars
    transferFail: (state, action) => {
      state.transaction = {
        transactionType: "Transfer",
        isPending: false,
        isSuccessful: false,
        isError: true,
      };
      state.transferInProgress = false;
    },
    // making order cases
    // eslint-disable-next-line no-unused-vars
    newOrderRequest: (state, action) => {
      state.transaction = {
        transactionType: "New Order",
        isPending: true,
        isSuccessful: false,
        isError: false,
      };
    },
    newOrderSuccess: (state, action) => {
      state.transaction = {
        transactionType: "New Order",
        isPending: false,
        isSuccessful: true,
        isError: false,
      };
      state.events = [action.payload.event, ...state.events];

      // Prevent duplicate orders from being added to store
      const orderExists = state.allOrders.data.some(
        (order) => order.id.toString() === action.payload.order.id.toString()
      );

      state.allOrders = {
        ...state.allOrders,
        data: orderExists
          ? state.allOrders.data
          : [...state.allOrders.data, action.payload.order],
        loaded: true,
      };
    },
    // eslint-disable-next-line no-unused-vars
    newOrderFail: (state, action) => {
      state.transaction = {
        transactionType: "New Order",
        isPending: false,
        isSuccessful: false,
        isError: true,
      };
    },
  },
});

export const {
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
} = exchangeSlice.actions;
export default exchangeSlice.reducer;
