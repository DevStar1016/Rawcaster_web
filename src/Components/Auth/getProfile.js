import { toast } from "react-hot-toast";
import {
  getProfileService,
  getUserSettingsService,
} from "../../Services/ApiService";
import ConnectSocket from "../../Services/SocketService";
import { decodeHtml, getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import {
  handleAccountActive,
  handleLoginData,
  handleToken,
  handleisSuccess,
  handleuserSettings,
} from "../../Store/Redux/Reducer/AuthReducer";
import { handleprofileVerifyModalShow } from "../../Store/Redux/Reducer/DashboardReducer";
import { fetchFrindsbyId, fetchgroupsbyId } from "../../Store/Redux/Action";

export const getProfile = (token, dispatch) => {
  let promise = new Promise((resolve, reject) => {
    let profileData = {
      token: token,
      auth_code: getAuthToken(token),
    };
    getProfileService(JSONtoformdata(profileData))
      .then((res) => {
        if (res.data.status === 1) {
          getUserSettings(token, dispatch);
          let profileData = {
            ...res.data.profile,
            first_name: decodeHtml(res.data.profile.first_name),
            last_name: decodeHtml(res.data.profile.last_name),
            name: decodeHtml(res.data.profile.name),
          };
          dispatch(fetchFrindsbyId(token));
          dispatch(
            fetchgroupsbyId({ token: token, user_id: profileData.user_id })
          );

          dispatch(handleLoginData({ token: token, ...profileData }));

          dispatch(handleToken(token));
          if (res.data.profile.acc_verify_status === 0) {
            handleVerifyModal(res.data.profile, dispatch);
          }

          ConnectSocket(res.data.profile);
          resolve(res.data.profile);
        } else {
          reject();
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        reject();
        toast.error(err.message);
      })
      .finally(() => {
        dispatch(handleisSuccess(true));
      });
  });
  return promise;
};

export const getUserSettings = (token, dispatch) => {
  let promise = new Promise((resolve, reject) => {
    let profileData = {
      token: token,
      auth_code: getAuthToken(token),
    };
    getUserSettingsService(JSONtoformdata(profileData))
      .then((res) => {
        if (res.data.status === 1) {
          if (window.location.pathname !== "/setting") {
            if (res.data.settings.account_active_inactive === 0) {
              dispatch(handleAccountActive(true));
            }
          }
          dispatch(handleuserSettings(res.data.settings));
          resolve(res.data.settings);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  });
  return promise;
};

export const handleVerifyModal = (res, dispatch) => {
  if (res.is_email_id_verified === 0 && res.is_email_id_verified === 0) {
    if (res.is_profile_updated === 1) {
      dispatch(
        handleprofileVerifyModalShow({
          show: true,
          msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
        })
      );
    } else {
      dispatch(
        handleprofileVerifyModalShow({
          show: true,
          msg: "Do you want to complete your profile now?",
        })
      );
    }
  }
};
