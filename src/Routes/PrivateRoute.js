import { Navigate, Outlet } from "react-router";
import { getCookieData } from "../Store/Storage";

export const AuthPrivateRoute = ({ auth, children }) => {
  return getCookieData("rawcaster_user_token") ? (
    <Navigate to="/selectinfluencers" />
  ) : (
    <Outlet />
  );
  // return children;
};

export const HomePrivateRoute = ({ auth, children }) => {
  console.log(getCookieData("rawcaster_user_token"));
  return getCookieData("rawcaster_user_token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
  // return children;
};
