import { toast } from "react-hot-toast";
import {
  getProfileService,
  getUserSettingsService,
} from "../../Services/ApiService";
import ConnectSocket from "../../Services/SocketService";
import {
  decodeHtml,
  DecryptionString,
  getAuthToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import {
  handleLoginData,
  handleToken,
  handleisSuccess,
  handleuserSettings,
} from "../../Store/Redux/Reducer/AuthReducer";
import { handleprofileVerifyModalShow } from "../../Store/Redux/Reducer/DashboardReducer";
import {
  fetchFrindsbyId,
  fetchNuggetsbyId,
  fetchgroupsbyId,
} from "../../Store/Redux/Action";
import { handleNuggetFormData } from "../../Store/Redux/Reducer/NuggetsReducer";

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
          let finalData = {
            token: token,
            formData: { page_number: 1, nugget_type: 0 },
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
  let profileData = {
    token: token,
    auth_code: getAuthToken(token),
  };
  getUserSettingsService(JSONtoformdata(profileData))
    .then((res) => {
      if (res.data.status === 1) {
        dispatch(handleuserSettings(res.data.settings));
      } else {
        toast.error(res.data.msg);
      }
    })
    .catch((err) => {
      toast.error(err.message);
    });
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
