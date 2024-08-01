import { createSlice } from "@reduxjs/toolkit";

const exchangeSlice = createSlice({
  name: "exchange",
  initialState: {
    loaded: false,
    contract: {},
  },
  reducers: {
    exchangeLoaded: (state, action) => {
      state.loaded = true;
      state.contract = action.payload.exchange;
    },
  },
});

export const { exchangeLoaded } = exchangeSlice.actions;
export default exchangeSlice.reducer;
