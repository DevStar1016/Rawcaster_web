import { toast } from "react-hot-toast";
import { getProfileService } from "../../Services/ApiService";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";
import { handleprofileVerifyModalShow } from "../../Store/Redux/Reducer/DashboardReducer";
import { setCookieData, setLocalStorageData } from "../../Store/Storage";

export const getProfile = (token, dispatch) => {
  let profileData = {
    token: token,
    auth_code: getAuthToken(token),
  };
  getProfileService(JSONtoformdata(profileData))
    .then((res) => {
      if (res.data.status === 1) {
        dispatch(handleLoginData({ token: token, ...res.data.profile }));
        setCookieData("rawcaster_user_token", JSON.stringify(token));
        setLocalStorageData(
          "rawcaster_user_token",
          JSON.stringify({ token: token, ...res.data.profile })
        );
        if (res.data.profile.acc_verify_status === 0) {
          handleVerifyModal(res.data.profile, dispatch);
        }
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
