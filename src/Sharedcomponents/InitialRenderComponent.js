import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ErrorHandling,
  RemoveToken,
  getRawcaserToken,
} from "../Shared/Utility";
import { handleisSuccess } from "../Store/Redux/Reducer/AuthReducer";
import { useEffect } from "react";
import { fetchuserInfobyToken } from "../Store/Redux/Action";
import ConnectSocket from "../Services/SocketService";

const InitialRenderComponent = () => {
  const dispatch = useDispatch();
  axios.interceptors.response.use(
    function (response) {
      if (response.data.status === -1) {
        // RemoveToken(dispatch);
        // window.location.reload();
      }
      return response;
    },
    function (error) {
      if (!error.message.includes("Request Cancelled")) {
        ErrorHandling(error);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (getRawcaserToken()) {
      let userData = getRawcaserToken();
      dispatch(fetchuserInfobyToken(userData.token)).then(({ payload }) => {
        ConnectSocket(payload);
      });
    } else {
      dispatch(handleisSuccess(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default InitialRenderComponent;
