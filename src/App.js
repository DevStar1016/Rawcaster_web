import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { removeSessionStorageData } from "./Store/Storage";
import { useDispatch } from "react-redux";
import { routerpaths } from "./Routes";
import { handleisSuccess } from "./Store/Redux/Reducer/AuthReducer";
import { RemoveToken, getRawcaserToken } from "./Shared/Utility";
import { useDashboard } from "./Shared/Reduxfetcher";
import Spinner from "./Sharedcomponents/Spinner";
import axios from "axios";
import ConnectSocket from "./Services/SocketService";
import { getProfile } from "./Components/Auth/getProfile";
import { fetchFrindsbyId, fetchgroupsbyId } from "./Store/Redux/Action";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location]);

  axios.interceptors.response.use(
    function (response) {
      if (response.data.status === -1) {
        RemoveToken(dispatch);
        window.location.reload();
      }
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (getRawcaserToken()) {
      let userData = getRawcaserToken();
      getProfile(userData.token, dispatch)
        .then((res) => {
          dispatch(fetchFrindsbyId(userData.token));
          dispatch(
            fetchgroupsbyId({ token: userData.token, user_id: res.user_id })
          );
          ConnectSocket(res);
        })
        .finally(() => {
          dispatch(handleisSuccess(true));
        });
    } else {
      dispatch(handleisSuccess(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
