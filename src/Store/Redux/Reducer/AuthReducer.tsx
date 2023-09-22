/**
 * Redux slice for managing authentication-related state.
 * @module auth
 */
import { createSlice } from "@reduxjs/toolkit";
import { getCookieData } from "../../Storage";
import { fetchuserInfobyToken, fetchuserSettingsbyToken } from "../Action";
import { AuthData } from "../types/Auth";

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

const initialState: AuthData = {
  isLoading: false,
  isSuccess: false,
  loginUserData: null,
  loginToken: getRawcaserToken(),
  userSettings: null,
  isAccountActive: false,
  eventTempUserData: null,
};

export const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleAuthReset: (state, action) => {
      state = {
        isLoading: false,
        isSuccess: false,
        loginUserData: null,
        loginToken: null,
        userSettings: null,
        isAccountActive: false,
        eventTempUserData: null,
      };
    },
    handleLoginData: (state, action) => {
      state.loginUserData = action.payload;
    },
    handleAccountVerifyStatus: (state, action) => {
      if (state.loginUserData) {
        state.loginUserData = {
          ...state.loginUserData,
          account_verify_type: action.payload,
        };
      }
    },
    handleisSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
    handleisLoading: (state, action) => {
      state.isLoading = action.payload;
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
    handleeventTempUserData: (state, action) => {
      state.eventTempUserData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchuserInfobyToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchuserInfobyToken.fulfilled, (state, action) => {
      state.loginUserData = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(fetchuserSettingsbyToken.fulfilled, (state, action) => {
      state.userSettings = action.payload;
    });
  },
});

export const {
  handleLoginData,
  handleisLoading,
  handleToken,
  handleuserSettings,
  handleisSuccess,
  handleAccountActive,
  handleeventTempUserData,
  handleAccountVerifyStatus,
  handleAuthReset,
} = actions;

export default reducer;
