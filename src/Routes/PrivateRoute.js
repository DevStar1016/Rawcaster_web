import { Navigate } from "react-router";

export const AuthPrivateRoute = ({ auth, children }) => {
  return auth ? children : <Navigate to="/selectinfluencers" />;
  // return children;
};

export const HomePrivateRoute = ({ auth, children }) => {
  return auth ? children : <Navigate to="/login" />;
  // return children;
};
