import { createSlice } from "@reduxjs/toolkit";

const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    loaded: false,
    contracts: [],
    symbols: [],
  },
  reducers: {
    token1Loaded: (state, action) => {
      state.loaded = true;
      state.contracts = [...state.contracts, action.payload.token];
      state.symbols = [...state.symbols, action.payload.symbol];
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
