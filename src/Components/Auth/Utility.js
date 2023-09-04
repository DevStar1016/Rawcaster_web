import {
  getSessionStorageData,
  removeSessionStorageData,
} from "../../Store/Storage";

/**
 * Handles the verification process for an account.
 * @param {object} res - The response object containing verification data.
 * @param {string} type - The type of account being verified (e.g. email, phone).
 * @param {function} navigate - The function used to navigate to different routes.
 * @returns None
 */
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
  window.location.reload();
};
