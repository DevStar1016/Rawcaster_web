import { RouterProvider, useNavigate } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { getLocalStorageData, removeSessionStorageData } from "./Store/Storage";
import HomeLayout from "./Layouts/HomeLayout";
import AuthLayout from "../src/Layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootElement } from "./Routes";
import { handleLoginData } from "./Store/Redux/Reducer/AuthReducer";
import Homepage from "./Components/Homepage/Homepage";
import Spinner from "./Sharedcomponents/Spinner";
import MainLayout from "./Layouts/MainLayout";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import axios from "axios";
import { RemoveToken } from "./Shared/Utility";
import { toast } from "react-hot-toast";
import Privacypolicy from "./Components/Policy/Privacypolicy";
import TermsandConditions from "./Components/Policy/TermsandConditions";
import Cookiespolicy from "./Components/Policy/CookiePolicy";
import Contactus from "./Components/Policy/Contactus";
import ProfileVerification from "./ProfileVerification";
import UpdateProfile from "./ProfileVerification/UpdateProfile";
import VerifyOtp from "./ProfileVerification/VerifyOtp";
import Development from "./Components/Development";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.dashboard);

  const routerpaths = [
    {
      path: "/",
      children: RootElement(),
    },
    {
      path: "/",
      element: <ProfileVerification />,
      children: [
        {
          path: "/profile",
          element: <UpdateProfile />,
        },
        {
          path: "/verifyotp",
          element: <VerifyOtp />,
        },
      ],
    },
    {
      path: "/dev",
      element: <Development />,
    },
  ];
  const router = createBrowserRouter(routerpaths, { basename: "/" });

  useEffect(() => {
    if (window.location.pathname !== "/setpassword") {
      removeSessionStorageData("CountDown");
    }
    if (window.location.pathname !== "/verifyotp") {
      removeSessionStorageData("verifyCountDown");
    }
  }, [window.location]);

  axios.interceptors.response.use(
    function (response) {
      if (response.data.status === -1) {
        RemoveToken(dispatch);
        window.location.assign("/login");
        toast.error(response.data.msg);
      }
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (getLocalStorageData("rawcaster_user_token")) {
      dispatch(
        handleLoginData(JSON.parse(getLocalStorageData("rawcaster_user_token")))
      );
    }
  }, []);

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
