import { createSlice } from "@reduxjs/toolkit";
import { fetchFrindsbyId, fetchgroupsbyId } from "../Action";

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
  isFriendsLoading: true,
  groupsList: [],
  isGroupLoading: true,
  Nuggets: [],
  isNuggetsLoading: true,
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
    handleGroupsList: (state, action) => {
      state.groupsList = action.payload;
    },
    handleisNuggetMuted: (state, action) => {
      state.isNuggetMuted = action.payload;
    },
    handleDashboardFilterType: (state, action) => {
      state.DashboardfilterType = action.payload;
    },
    handleNuggetList: (state, action) => {
      state.Nuggets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFrindsbyId.fulfilled, (state, action) => {
      state.friendsList = action.payload;
      state.isFriendsLoading = false;
    });
    builder.addCase(fetchFrindsbyId.rejected, (state, action) => {
      state.isFriendsLoading = false;
    });
    builder.addCase(fetchgroupsbyId.fulfilled, (state, action) => {
      state.groupsList = action.payload;
      state.isGroupLoading = false;
    });
    builder.addCase(fetchgroupsbyId.rejected, (state, action) => {
      state.isGroupLoading = false;
    });
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
  handleGroupsList,
  handleisNuggetMuted,
  handleDashboardFilterType,
  handleNuggetList,
} = actions;

export default reducer;
