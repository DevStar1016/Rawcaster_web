import { Navigate, Outlet } from "react-router";
import { getCookieData } from "../Store/Storage";

export const AuthPrivateRoute = () => {
  return getCookieData("rawcaster_user_token") ? (
    <Navigate to="/dashboard" />
  ) : (
    <Outlet />
  );
  // return children;
};

export const HomePrivateRoute = () => {
  return getCookieData("rawcaster_user_token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
  // return children;
};
