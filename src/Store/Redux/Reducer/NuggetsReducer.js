import { createSlice } from "@reduxjs/toolkit";
import { fetchNuggetsbyId } from "../Action";

const initialState = {
  nuggetVideoPaused: false,
  nuggetFormData: {},
  Nuggets: [],
  isNuggetsLoading: true,
  isNuggetMuted: false,
  DashboardfilterType: 0,
  currentpage: 0,
  totalpages: 0,
  totalNuggets: 0,
  isNextPageLoading: false,
};

export const { actions, reducer } = createSlice({
  name: "nuggets",
  initialState,
  reducers: {
    handlenuggetVideoPaused: (state, action) => {
      state.nuggetVideoPaused = action.payload;
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
    handleNuggetFormData: (state, action) => {
      state.nuggetFormData = action.payload;
    },
    handleResetNuggets: (state, action) => {
      state.Nuggets = [];
      state.totalpages = 0;
      state.currentpage = 0;
      state.totalNuggets = 0;
      state.isNuggetsLoading = false;
      state.isNextPageLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNuggetsbyId.pending, (state, action) => {
      if (state.currentpage !== 0) {
        state.isNextPageLoading = true;
      } else {
        state.isNuggetsLoading = true;
      }
    });
    builder.addCase(fetchNuggetsbyId.fulfilled, (state, action) => {
      state.Nuggets = action.payload.data;
      state.totalpages = action.payload.total_count;
      state.currentpage = action.payload.current_page_no;
      state.totalNuggets = action.payload.total_count;
      state.isNuggetsLoading = false;
      state.isNextPageLoading = false;
    });
    builder.addCase(fetchNuggetsbyId.rejected, (state, action) => {
      state.isNuggetsLoading = false;
      state.isNextPageLoading = false;
    });
  },
});

export const {
  handlenuggetVideoPaused,
  handleisNuggetMuted,
  handleDashboardFilterType,
  handleNuggetList,
  handleNuggetFormData,
  handleResetNuggets,
} = actions;

export default reducer;
