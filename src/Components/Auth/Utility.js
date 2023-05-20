import {
  getSessionStorageData,
  removeSessionStorageData,
} from "../../Store/Storage";

export const accountVerifyHandle = (res, type, navigate) => {
  const { otp_ref_id, remaining_seconds, alt_token_id } = res;
  const handleNavigateValue = () => {
    if (getSessionStorageData("influencerData")) {
      removeSessionStorageData("influencerData");
      return "/selectinfluencers";
    } else if (res.first_time) {
      return "/selectinfluencers";
    } else {
      return "/dashboard";
    }
  };
  navigate("/verifyotp", {
    state: {
      type: type,
      msg: `OTP sent to your ${type}`,
      navigatePath: handleNavigateValue(),
      otp_ref_id,
      remaining_seconds,
      alt_token_id,
    },
  });
};
