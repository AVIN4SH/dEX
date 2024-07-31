import { createSlice } from "@reduxjs/toolkit";

const providerSlice = createSlice({
  name: "provider",
  initialState: {},
  reducers: {
    providerLoaded: (state, action) => {
      state.connection = action.payload.connection;
    },
    networkLoaded: (state, action) => {
      state.chainId = action.payload.chainId;
    },
    accountLoaded: (state, action) => {
      state.account = action.payload.account;
    },
  },
});

export const { providerLoaded, networkLoaded, accountLoaded } =
  providerSlice.actions;

export default providerSlice.reducer;
