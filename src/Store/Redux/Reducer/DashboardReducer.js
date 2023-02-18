import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isTwoStepVerified: false,
};

export const { actions, reducer } = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    handleLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    handleTwoStepVerified: (state, action) => {
      state.isTwoStepVerified = action.payload;
    },
  },
});

export const { handleLoading, handleTwoStepVerified } = actions;

export default reducer;
