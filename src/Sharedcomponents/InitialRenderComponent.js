import React from "react";
import { useDispatch } from "react-redux";
import { useNuggets } from "../Shared/Reduxfetcher";
import { removeSessionStorageData } from "../Store/Storage";
import axios from "axios";
import {
  DecryptionString,
  RemoveToken,
  getRawcaserToken,
} from "../Shared/Utility";
import { getProfile } from "../Components/Auth/getProfile";
import { handleNuggetFormData } from "../Store/Redux/Reducer/NuggetsReducer";
import { fetchNuggetsbyId } from "../Store/Redux/Action";
import ConnectSocket from "../Services/SocketService";
import { handleisSuccess } from "../Store/Redux/Reducer/AuthReducer";
import { useEffect } from "react";

const InitialRenderComponent = () => {
  const dispatch = useDispatch();

  const { Nuggets } = useNuggets();

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
          ConnectSocket(res);
        })
        .finally(() => {
          dispatch(handleisSuccess(true));
        });
    } else {
      let finalData = {
        token: "RAWCAST",
        formData: { page_number: 1, nugget_type: 0 },
        Nuggets: Nuggets,
      };
      if (window.location.pathname.includes("globalsearch")) {
        let splitData = window.location.pathname.split("/");
        finalData = {
          ...finalData,
          formData: {
            ...finalData.formData,
            search_key: splitData[2],
          },
        };
      } else if (window.location.pathname.includes("viewprofile")) {
        let splitData = window.location.pathname.split("/");
        finalData = {
          ...finalData,
          formData: {
            ...finalData.formData,
            user_id:
              splitData[2] && splitData[2] !== ""
                ? DecryptionString(splitData[2])
                : null,
          },
        };
      }
      dispatch(handleNuggetFormData(finalData));
      dispatch(fetchNuggetsbyId(finalData));
      dispatch(handleisSuccess(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default InitialRenderComponent;
