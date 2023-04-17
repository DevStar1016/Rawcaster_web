import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { RemoveToken, getRawcaserToken } from "../Shared/Utility";
import { getProfile } from "../Components/Auth/getProfile";
import ConnectSocket from "../Services/SocketService";
import { handleisSuccess } from "../Store/Redux/Reducer/AuthReducer";
import { useEffect } from "react";

const InitialRenderComponent = () => {
  const dispatch = useDispatch();

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

  return <></>;
};

export default InitialRenderComponent;
