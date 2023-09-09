/**
 * A React component that is responsible for handling the initial rendering of the application.
 * It performs various tasks such as dispatching actions, making API requests, handling errors,
 * and connecting to a socket service.
 * @returns A React component that renders nothing.
 */
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ErrorHandling,
  RemoveToken,
  getRawcaserToken,
} from "../Shared/Utility";
import {
  handleisLoading,
  handleisSuccess,
} from "../Store/Redux/Reducer/AuthReducer";
import { useEffect } from "react";
import { fetchuserInfobyToken } from "../Store/Redux/Action";
import { handleLoading } from "../Store/Redux/Reducer/DashboardReducer";

const InitialRenderComponent = () => {
  const dispatch = useDispatch();
  axios.interceptors.response.use(
    function (response) {
      if (response?.data?.status === -1) {
        console.log(response?.data);
        RemoveToken(dispatch);
        window.location.reload();
      }
      return response;
    },
    function (error) {
      if (!axios.isCancel(error) && error) {
        ErrorHandling(error);
      }
    }
  );

  /**
   * Executes a side effect when the component mounts or when the value of `getRawcaserToken()` changes.
   * If `getRawcaserToken()` returns a truthy value, it fetches user information using the token and connects to a socket.
   * If `getRawcaserToken()` returns a falsy value, it dispatches actions to handle loading, success, and error states.
   * @returns None
   */
  useEffect(() => {
    if (getRawcaserToken()) {
      // if (!isSuccess) {
      let userData = getRawcaserToken();
      dispatch(fetchuserInfobyToken(userData.token));
      // } else {
      //   dispatch(handleLoading(false));
      //   dispatch(handleisLoading(false));
      // }
    } else {
      dispatch(handleLoading(false));
      dispatch(handleisLoading(false));
      dispatch(handleisSuccess(true));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default InitialRenderComponent;
