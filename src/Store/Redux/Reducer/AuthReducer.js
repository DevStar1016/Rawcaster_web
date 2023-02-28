import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginUserData: null,
  loginToken: null,
};

export const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLoginData: (state, action) => {
      state.loginUserData = action.payload;
    },
    handleToken: (state, action) => {
      state.loginToken = action.payload;
    },
  },
});

export const { handleLoginData, handleToken } = actions;

export default reducer;
