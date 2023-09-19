/**
 * Redux slice for managing the dashboard state.
 * @module dashboard
 */
import { createSlice } from "@reduxjs/toolkit";
import { fetchFrindsbyId, fetchgroupsbyId } from "../Action";
import { DashoardProps } from "../types/Dashboard";

const initialState: DashoardProps = {
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
  notificationUnreadCount: 0,
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
    handleUpdateChatGroupData: (state, action) => {
      const id = action.payload.id;
      const findIndex = state.groupsList.findIndex(
        (ele) => ele.group_id === parseInt(id)
      );
      if (findIndex !== -1) {
        state.groupsList = [
          ...state.groupsList.slice(0, findIndex),
          {
            ...state.groupsList[findIndex],
            chat_enabled: action.payload.chat_enabled,
          },
          ...state.groupsList.slice(findIndex + 1, state.groupsList.length),
        ];
      } else {
        state.groupsList = [
          ...state.groupsList,
          {
            ...action.payload.Group,
          },
        ];
      }
    },
    handleUpdateGroupData: (state, action) => {
      const id = action.payload.id;
      const findIndex = state.groupsList.findIndex(
        (ele) => ele.group_id === parseInt(id)
      );
      if (findIndex !== -1) {
        state.groupsList = [
          ...state.groupsList.slice(0, findIndex),
          {
            ...action.payload.Group,
          },
          ...state.groupsList.slice(findIndex + 1, state.groupsList.length),
        ];
      } else {
        state.groupsList = [
          ...state.groupsList,
          {
            ...action.payload.Group,
          },
        ];
      }
    },
    handleUpdateIndividualArnData: (state, action) => {
      const id = action.payload.id;
      const findIndex = state.friendsList.findIndex(
        (ele) => ele.user_id === parseInt(id)
      );
      if (findIndex !== -1) {
        state.friendsList[findIndex].channel_arn = action.payload.channel_arn;
      }
    },
    handleUpdateGroupArnData: (state, action) => {
      const id = action.payload.id;
      const findIndex = state.groupsList.findIndex(
        (ele) => ele.group_id === parseInt(id)
      );
      if (findIndex !== -1) {
        state.groupsList[findIndex].channel_arn = action.payload.channel_arn;
      }
    },
    handleDeleteGroupData: (state, action) => {
      state.groupsList = state.groupsList.filter(
        (ele) => ele.group_id !== action.payload
      );
    },
    handleNotificationUnreadCount: (state, action) => {
      state.notificationUnreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFrindsbyId.fulfilled, (state, action) => {
      state.friendsList = action.payload;
      state.isFriendsLoading = false;
    });
    builder.addCase(fetchFrindsbyId.rejected, (state) => {
      state.isFriendsLoading = false;
    });
    builder.addCase(fetchgroupsbyId.fulfilled, (state, action) => {
      state.groupsList = action.payload;
      state.isGroupLoading = false;
    });
    builder.addCase(fetchgroupsbyId.rejected, (state) => {
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
  handleAddGroupData,
  handleUpdateGroupData,
  handleDeleteGroupData,
  handleNotificationUnreadCount,
  handleUpdateChatGroupData,
  handleUpdateGroupArnData,
  handleUpdateIndividualArnData,
} = actions;

export default reducer;
