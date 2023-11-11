/**
 * Creates a Redux slice for the "utility" module.
 * @module utilitySlice
 * @returns {Object} An object containing the actions and reducer for the utility module.
 */
import { createSlice } from "@reduxjs/toolkit";
import { UtilityReducerProps } from "../types/Utility";

const initialState: UtilityReducerProps = {
  eventWindowRef: null,
  isFromGroup: null,
};

const { actions, reducer } = createSlice({
  name: "utility",
  initialState,
  reducers: {
    handleEventWindowRef: (state, action) => {
      state.eventWindowRef = action.payload;
    },
    handleisFromGroup: (state, action) => {
      state.isFromGroup = action.payload;
    },
  },
});

export const { handleEventWindowRef, handleisFromGroup } = actions;
export default reducer;
