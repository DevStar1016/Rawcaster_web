import React from "react";
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
import ConnectSocket from "../Services/SocketService";
import { useAuth } from "../Shared/Reduxfetcher";
import { handleLoading } from "../Store/Redux/Reducer/DashboardReducer";

const InitialRenderComponent = () => {
  const dispatch = useDispatch();
  const { isSuccess } = useAuth();
  axios.interceptors.response.use(
    function (response) {
      if (response?.data?.status === -1) {
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

  useEffect(() => {
    if (getRawcaserToken()) {
      // if (!isSuccess) {
      let userData = getRawcaserToken();
      dispatch(fetchuserInfobyToken(userData.token)).then(({ payload }) => {
        ConnectSocket(payload);
      });
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
