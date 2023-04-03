import { Navigate, Outlet } from "react-router";
import { getCookieData } from "../Store/Storage";
import { getRawcaserToken } from "../Shared/Utility";

export const AuthPrivateRoute = () => {
  return getRawcaserToken() ? <Navigate to="/dashboard" /> : <Outlet />;
  // return children;
};

export const HomePrivateRoute = () => {
  return getRawcaserToken() ? <Outlet /> : <Navigate to="/login" />;
  // return children;
};
