import ForgotPassword from "../Components/Auth/ForgotPassword";
import Login from "../Components/Auth/Login";
import ResetPassword from "../Components/Auth/ResetPassword";
import Signup from "../Components/Auth/Signup";
import SignupwithCredentials from "../Components/Auth/SignupwithCredentials";
import Homepage from "../Components/Homepage/Homepage";
import AppdownloadScreen from "../Components/Policy/AppdownloadScreen";
import Contactus from "../Components/Policy/Contactus";
import Cookiespolicy from "../Components/Policy/CookiePolicy";
import Faq from "../Components/Policy/Faq";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
import AuthLayout from "../Layouts/AuthLayout";
import MainLayout from "../Layouts/MainLayout";
import { AuthPrivateRoute } from "./PrivateRoute";

export const AuthRoute = () => {
  return [
    {
      path: "/",
      element: <AuthPrivateRoute />,
      children: [
        {
          path: "/",
          element: <AuthLayout />,
          children: [
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/signup",
              element: <Signup />,
            },
            {
              path: "/signupwithemail",
              element: <SignupwithCredentials />,
            },
            {
              path: "/signupwithmobile",
              element: <SignupwithCredentials />,
            },
            {
              path: "/forgotpassword",
              element: <ForgotPassword />,
            },
            {
              path: "/setpassword",
              element: <ResetPassword />,
            },
          ],
        },
        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Homepage />,
            },
            {
              path: "privacypolicy",
              element: <Privacypolicy />,
            },
            {
              path: "termsandconditions",
              element: <TermsandConditions />,
            },
            {
              path: "cookiespolicy",
              element: <Cookiespolicy />,
            },
            {
              path: "support",
              element: <Contactus />,
            },
            {
              path: "faq",
              element: <Faq />,
            },
            {
              path: "appdownloadscreen",
              element: <AppdownloadScreen />,
            },
          ],
        },
      ],
    },
  ];
};
