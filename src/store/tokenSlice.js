import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    loaded: false,
    contract: null,
    symbol: null,
  },
  reducers: {
    tokenLoaded: (state, action) => {
      state.loaded = true;
      state.contract = action.payload.token;
      state.symbol = action.payload.symbol;
    },
  },
});

export const { tokenLoaded } = tokenSlice.actions;
export default tokenSlice.reducer;
