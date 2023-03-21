import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isTwoStepVerified: false,
  loginModalShow: false,
  profileVerifyModalShow: { show: false, msg: "" },
  twostepVerifyModalshow: false,
  dashboardMenu: "nugget",
  isVeifyEnabled: false,
  nuggetVideoPaused: false,
  isGlobalSearch: false,
  friendsList: [],
  isNuggetMuted: false,
  DashboardfilterType: 0,
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
    handleprofileVerifyModalShow: (state, action) => {
      state.profileVerifyModalShow = action.payload;
    },
    handleloginModalShow: (state, action) => {
      state.loginModalShow = action.payload;
    },
    handledasboardTab: (state, action) => {
      state.dashboardMenu = action.payload;
    },
    handletwostepVerifyModalshow: (state, action) => {
      state.twostepVerifyModalshow = action.payload;
    },
    handleverifyEnabled: (state, action) => {
      state.isVeifyEnabled = action.payload;
    },
    handlenuggetVideoPaused: (state, action) => {
      state.nuggetVideoPaused = action.payload;
    },
    handleisGlobalSearch: (state, action) => {
      state.isGlobalSearch = action.payload;
    },
    handleFriendsList: (state, action) => {
      state.friendsList = action.payload;
    },
    handleisNuggetMuted: (state, action) => {
      state.isNuggetMuted = action.payload;
    },
    handleDashboardFilterType: (state, action) => {
      state.DashboardfilterType = action.payload;
    },
  },
});

export const {
  handleLoading,
  handleTwoStepVerified,
  handleprofileVerifyModalShow,
  handledasboardTab,
  handleloginModalShow,
  handletwostepVerifyModalshow,
  handleverifyEnabled,
  handlenuggetVideoPaused,
  handleisGlobalSearch,
  handleFriendsList,
  handleisNuggetMuted,
  handleDashboardFilterType,
} = actions;

export default reducer;
