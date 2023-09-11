/**
 * Combines multiple reducers into a single root reducer using the `combineReducers` function from the `@reduxjs/toolkit` library.
 * @returns {Object} - The root reducer object.
 */
import { combineReducers } from "@reduxjs/toolkit";
import DashboardReducer from "../Reducer/DashboardReducer";
import AuthReducer from "../Reducer/AuthReducer";
import NuggetReducer from "../Reducer/NuggetsReducer";
import notificationReducer from "../Reducer/NotificationsReducer";
import utilityReducer from "../Reducer/UtilityReducer";
import { store } from "./Store";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  nuggets: NuggetReducer,
  notification: notificationReducer,
  utility: utilityReducer,
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
