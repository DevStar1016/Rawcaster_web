import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const { actions, reducer } = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    handleLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { handleLoading } = actions;

export default reducer;
