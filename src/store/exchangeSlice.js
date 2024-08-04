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
  },
  reducers: {
    exchangeLoaded: (state, action) => {
      state.loaded = true;
      state.contract = action.payload.exchange;
    },
    exchnageToken1BalanceLoaded: (state, action) => {
      state.balances[0] = action.payload.balance;
    },
    exchnageToken2BalanceLoaded: (state, action) => {
      state.balances[1] = action.payload.balance;
    },
    // tracking transfer cases (deposit & withdraw)
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
    transferFail: (state, action) => {
      state.transaction = {
        transactionType: "Transfer",
        isPending: false,
        isSuccessful: false,
        isError: true,
      };
      state.transferInProgress = false;
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
} = exchangeSlice.actions;
export default exchangeSlice.reducer;
