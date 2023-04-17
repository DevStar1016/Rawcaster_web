import { createSlice } from "@reduxjs/toolkit";
import { getCookieData } from "../../Storage";

const getRawcaserToken = () => {
  try {
    let userData = JSON.parse(getCookieData("rawcaster_user_token"));
    if (userData) {
      return userData.token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const initialState = {
  isLoading: false,
  isSuccess: false,
  loginUserData: null,
  loginToken: getRawcaserToken(),
  userSettings: null,
  isAccountActive: false,
};

export const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLoginData: (state, action) => {
      state.loginUserData = action.payload;
    },
    handleisSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
    handleToken: (state, action) => {
      state.loginToken = action.payload;
    },
    handleuserSettings: (state, action) => {
      state.userSettings = action.payload;
    },
    handleAccountActive: (state, action) => {
      state.isAccountActive = action.payload;
    },
  },
});

export const {
  handleLoginData,
  handleToken,
  handleuserSettings,
  handleisSuccess,
  handleAccountActive,
} = actions;

export default reducer;
