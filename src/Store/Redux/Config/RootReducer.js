import { combineReducers } from "@reduxjs/toolkit";
import DashboardReducer from "../Reducer/DashboardReducer";
import AuthReducer from "../Reducer/AuthReducer";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
});
