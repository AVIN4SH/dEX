import { createSlice } from "@reduxjs/toolkit";

const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    loaded: false,
    contracts: [],
    symbols: [],
  },
  reducers: {
    // here we load token 1 by emptying the state and add token 2 to token1 using spread (this is to avoid tokens keep getting added one by one intead of removing older)
    token1Loaded: (state, action) => {
      state.loaded = true;
      state.contracts = [action.payload.token];
      state.symbols = [action.payload.symbol];
    },
    token2Loaded: (state, action) => {
      state.loaded = true;
      state.contracts = [...state.contracts, action.payload.token];
      state.symbols = [...state.symbols, action.payload.symbol];
    },
  },
});

export const { token1Loaded, token2Loaded } = tokensSlice.actions;
export default tokensSlice.reducer;
