import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import Homepage from "./Components/Homepage/Homepage";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import AuthContainerLayout from "./Layouts/AuthContainerLayout";
import AuthLayout from "./Layouts/AuthLayout";
import SignupwithCredentials from "./Components/Auth/SignupwithCredentials";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "/",
          element: <AuthContainerLayout />,
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
          path: "/home",
          element: <Homepage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
