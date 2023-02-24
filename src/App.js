import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { getLocalStorageData, removeSessionStorageData } from "./Store/Storage";
import { useDispatch } from "react-redux";
import { RootElement } from "./Routes";
import { handleLoginData } from "./Store/Redux/Reducer/AuthReducer";
import Spinner from "./Sharedcomponents/Spinner";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import axios from "axios";
import { RemoveToken } from "./Shared/Utility";
import { toast } from "react-hot-toast";
import ProfileVerification from "./ProfileVerification";
import UpdateProfile from "./ProfileVerification/UpdateProfile";
import VerifyOtp from "./ProfileVerification/VerifyOtp";
import Development from "./Components/Development";
import { useDashboard, useProfileVerifyModal } from "./Shared/Reduxfetcher";
import { VerificationModal } from "./Modal/ProfileVerificationModal";
import {
  handleloginModalShow,
  handleprofileVerifyModalShow,
} from "./Store/Redux/Reducer/DashboardReducer";
import LoginModal from "./Modal/LoginModal";

function App() {
  const dispatch = useDispatch();
  const { isLoading, loginModalShow } = useDashboard();
  const profileverifyStatus = useProfileVerifyModal();

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
      <VerificationModal
        open={profileverifyStatus.show}
        msg={profileverifyStatus.msg}
        close={() => {
          dispatch(handleprofileVerifyModalShow({ show: false, msg: "" }));
        }}
      />
    </>
  );
}

export default App;
