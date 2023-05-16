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
  isGlobalSearch: false,
  friendsList: [],
  isFriendsLoading: true,
  groupsList: [],
  isGroupLoading: true,
  DashboardfilterType: 0,
  claimAccount: {
    show: false,
    msg: "",
  },
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
    handleisGlobalSearch: (state, action) => {
      state.isGlobalSearch = action.payload;
    },
    handleFriendsList: (state, action) => {
      state.friendsList = action.payload;
    },
    handleClaimAccount: (state, action) => {
      state.claimAccount = action.payload;
    },
    handleAddGroupData: (state, action) => {
      state.groupsList = [
        ...state.groupsList,
        {
          ...action.payload,
        },
      ];
    },
    handleUpdateGroupData: (state, action) => {
      const index = action.payload.index;
      state.groupsList = [
        ...state.groupsList.slice(0, index),
        {
          ...action.payload.Group,
        },
        ...state.groupsList.slice(index + 1, state.groupsList.length),
      ];
    },
    handleDeleteGroupData: (state, action) => {
      state.groupsList = state.groupsList.filter(
        (ele) => ele.group_id !== action.payload
      );
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
  handleisGlobalSearch,
  handleFriendsList,
  handleClaimAccount,
  handleGroupData,
  handleAddGroupData,
  handleUpdateGroupData,
  handleDeleteGroupData,
} = actions;

export default reducer;
