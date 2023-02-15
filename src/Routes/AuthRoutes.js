import ForgotPassword from "../Components/Auth/ForgotPassword";
import Login from "../Components/Auth/Login";
import ResetPassword from "../Components/Auth/ResetPassword";
import Signup from "../Components/Auth/Signup";
import SignupwithCredentials from "../Components/Auth/SignupwithCredentials";
import { AuthPrivateRoute } from "./PrivateRoute";

export const AuthRoute = (isAuth = true) => {
  return [
    {
      path: "/login",
      element: (
        <AuthPrivateRoute auth={isAuth}>
          <Login />
        </AuthPrivateRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthPrivateRoute auth={isAuth}>
          <Signup />
        </AuthPrivateRoute>
      ),
    },
    {
      path: "/signupwithemail",
      element: (
        <AuthPrivateRoute auth={isAuth}>
          <SignupwithCredentials />
        </AuthPrivateRoute>
      ),
    },
    {
      path: "/signupwithmobile",
      element: (
        <AuthPrivateRoute auth={isAuth}>
          <SignupwithCredentials />
        </AuthPrivateRoute>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <AuthPrivateRoute auth={isAuth}>
          <ForgotPassword />
        </AuthPrivateRoute>
      ),
    },
    {
      path: "/setpassword",
      element: (
        <AuthPrivateRoute auth={isAuth}>
          <ResetPassword />
        </AuthPrivateRoute>
      ),
    },
  ];
};
