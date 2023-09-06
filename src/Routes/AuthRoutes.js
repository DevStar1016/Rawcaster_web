/**
 * Defines the routes for the authentication flow of the application.
 * @type {Array}
 * @property {string} path - The path of the route.
 * @property {ReactElement} element - The component to render for the route.
 * @property {ReactElement} [errorElement] - The component to render if there is an error.
 * @property {Array} [children] - An array of child routes.
 * @returns None
 */
import ForgotPassword from "../Components/Auth/ForgotPassword";
import Login from "../Components/Auth/Login";
import ResetPassword from "../Components/Auth/ResetPassword";
import Signup from "../Components/Auth/Signup";
import SignupwithCredentials from "../Components/Auth/SignupwithCredentials";
import JoinMeeting from "../Components/Events/Room/JoinMeeting";
import Homepage from "../Components/Homepage/Homepage";
import NotFound from "../Components/NotFound/NotFound";
import AppdownloadScreen from "../Components/Policy/AppdownloadScreen";
import Contactus from "../Components/Policy/Contactus";
import Cookiespolicy from "../Components/Policy/CookiePolicy";
import Faq from "../Components/Policy/Faq";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
import AuthLayout from "../Layouts/AuthLayout";
import MainLayout from "../Layouts/MainLayout";
import { AuthPrivateRoute } from "./PrivateRoute";

export const AuthRoute = [
  {
    path: "/",
    element: <AuthPrivateRoute />,
    errorElement: <NotFound />,
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
            path: "/login/:nugget_id",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <Signup />,
          },
          {
            path: "/signup/:nugget_id",
            element: <Signup />,
          },
          {
            path: "/signupwithemail",
            element: <SignupwithCredentials />,
          },
          {
            path: "/signupwithemail/:nugget_id",
            element: <SignupwithCredentials />,
          },
          {
            path: "/signupwithmobile",
            element: <SignupwithCredentials />,
          },
          {
            path: "/signupwithmobile/:nugget_id",
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
        errorElement: <NotFound />,
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
          {
            path: "/joinmeeting",
            element: <JoinMeeting />,
          },
          {
            path: "/join/:event/:ref_id",
            element: <JoinMeeting />,
          },
        ],
      },
    ],
  },
];
