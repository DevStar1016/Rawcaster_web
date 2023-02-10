import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginUserData: null,
};

export const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLoginData: (state, action) => {
      state.loginUserData = action.payload;
    },
  },
});

export const { handleLoginData } = actions;

export default reducer;
