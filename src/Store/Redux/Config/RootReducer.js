import { combineReducers } from "@reduxjs/toolkit";
import DashboardReducer from "../Reducer/DashboardReducer";
import AuthReducer from "../Reducer/AuthReducer";
import NuggetReducer from "../Reducer/NuggetsReducer";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  nuggets: NuggetReducer,
});
