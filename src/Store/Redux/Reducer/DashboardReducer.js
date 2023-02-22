import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isTwoStepVerified: false,
  profileVerifyModalShow: { show: false, msg: "" },
  dashboardMenu: "nugget",
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
    handledasboardTab: (state, action) => {
      state.dashboardMenu = action.payload;
    },
  },
});

export const {
  handleLoading,
  handleTwoStepVerified,
  handleprofileVerifyModalShow,
  handledasboardTab,
} = actions;

export default reducer;
