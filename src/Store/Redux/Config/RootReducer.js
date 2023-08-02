import { combineReducers } from "@reduxjs/toolkit";
import DashboardReducer from "../Reducer/DashboardReducer";
import AuthReducer from "../Reducer/AuthReducer";
import NuggetReducer from "../Reducer/NuggetsReducer";
import notificationReducer from "../Reducer/NotificationsReducer";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  nuggets: NuggetReducer,
  notification: notificationReducer,
});
