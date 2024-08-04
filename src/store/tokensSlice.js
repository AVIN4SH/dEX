import { createSlice } from "@reduxjs/toolkit";

const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    loaded: false,
    contracts: [],
    symbols: [],
    balances: [],
  },
  reducers: {
    // here we load token 1 by emptying the state and add token 2 to token1 using spread (this is to avoid tokens keep getting added one by one intead of removing older)
    token1Loaded: (state, action) => {
      state.loaded = true;
      state.contracts = [action.payload.token];
      state.symbols = [action.payload.symbol];
    },
    token1BalanceLoaded: (state, action) => {
      state.balances[0] = action.payload.balance;
    },
    token2Loaded: (state, action) => {
      state.loaded = true;
      state.contracts = [...state.contracts, action.payload.token];
      state.symbols = [...state.symbols, action.payload.symbol];
    },
    token2BalanceLoaded: (state, action) => {
      state.balances[1] = action.payload.balance;
    },
  },
});

export const {
  token1Loaded,
  token2Loaded,
  token1BalanceLoaded,
  token2BalanceLoaded,
} = tokensSlice.actions;
export default tokensSlice.reducer;
