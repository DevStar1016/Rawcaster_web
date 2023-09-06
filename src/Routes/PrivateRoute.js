/**
 * A React component that acts as a private route for authenticated users.
 * If the user has a valid token, it navigates to the "/dashboard" route.
 * Otherwise, it renders the child components defined within the <Outlet /> component.
 * @returns A React element representing the private route.
 */
import { Navigate, Outlet } from "react-router";
import { getRawcaserToken } from "../Shared/Utility";

export const AuthPrivateRoute = () => {
  return getRawcaserToken() ? <Navigate to="/dashboard" /> : <Outlet />;
  // return children;
};

export const HomePrivateRoute = () => {
  return getRawcaserToken() ? <Outlet /> : <Navigate to="/login" />;
  // return children;
};
