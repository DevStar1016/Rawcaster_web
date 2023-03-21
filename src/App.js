import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import {
  getCookieData,
  getLocalStorageData,
  removeSessionStorageData,
} from "./Store/Storage";
import { useDispatch } from "react-redux";
import { routerpaths } from "./Routes";
import {
  handleLoginData,
  handleToken,
} from "./Store/Redux/Reducer/AuthReducer";
import { RemoveToken } from "./Shared/Utility";
import { toast } from "react-hot-toast";
import { useDashboard } from "./Shared/Reduxfetcher";
import Spinner from "./Sharedcomponents/Spinner";
import axios from "axios";
import ConnectSocket, { socketListen } from "./Services/SocketService";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useDashboard();

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
      console.log(response.data);
      if (response.data.status === -1) {
        RemoveToken(dispatch);
        window.location.assign("/login");
        toast.dismiss();
        toast.error(response.data.msg);
      }
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (
      getLocalStorageData("rawcaster_user_token") &&
      getCookieData("rawcaster_user_token")
    ) {
      dispatch(
        handleLoginData(JSON.parse(getLocalStorageData("rawcaster_user_token")))
      );
      dispatch(handleToken(JSON.parse(getCookieData("rawcaster_user_token"))));
    }
  }, []);

  useEffect(() => {
    if (JSON.parse(getLocalStorageData("rawcaster_user_token"))) {
      let data = JSON.parse(getLocalStorageData("rawcaster_user_token"));
      ConnectSocket(data);
    }
  }, []);

  // Router

  const router = createBrowserRouter(routerpaths, { basename: "/" });

  return (
    <>
      {isLoading ? <Spinner /> : null}

      <RouterProvider router={router} />
    </>
  );
}

export default App;
