/**
 * Creates a Redux slice for managing socket-related state.
 * @param {object} initialState - The initial state of the slice.
 * @param {object} reducers - An object containing the reducer functions for the slice.
 * @returns An object containing the actions and reducer for the socket slice.
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listeners: {}, // Object to store socket event listeners
};

const { actions, reducer } = createSlice({
  name: "socket",
  initialState,
  reducers: {
    addListener: (state, action) => {
      const { listenerId, callback } = action.payload;
      state.listeners[listenerId] = callback;
    },
    removeListener: (state, action) => {
      const listenerId = action.payload;
      delete state.listeners[listenerId];
    },
  },
});

export const { addListener, removeListener } = actions;
export default reducer;
