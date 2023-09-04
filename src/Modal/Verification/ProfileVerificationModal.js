/**
 * A modal component for account verification.
 * @param {boolean} open - Whether the modal is open or not.
 * @param {function} close - Function to close the modal.
 * @returns A modal component for account verification.
 */
import { Button, Modal } from "antd";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { resendOtpService } from "../../Services/ApiService";
import { useAuthData } from "../../Shared/Reduxfetcher";
import {
  getAuthToken,
  isValidData,
  JSONtoformdata,
} from "../../Shared/Utility";
import { handletwostepVerifyModalshow } from "../../Store/Redux/Reducer/DashboardReducer";
import classes from "../Modal.module.css";

export const VerificationModal = ({ open, close }) => {
  const loginUserData = useAuthData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Handles the process of sending an OTP (One-Time Password) for verification.
   * @param {any} value - The value to be passed to the OTP service.
   * @returns None
   */
  const handleSendOTP = (value) => {
    let finalData = {
      auth_code: getAuthToken("Rawcaster"),
      token: loginUserData?.token,
      otp_flag: value,
    };
    resendOtpService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          navigate("/verifyotp", { state: { ...value, ...res.data } });
          window.location.reload();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {});
  };

  /**
   * Handles the validation process for the user.
   * If the user's account verification status is 0 and their profile is updated,
   * it checks if two-factor verification is enabled and if the user has a valid email and mobile number.
   * If all conditions are met, it dispatches an action to show the two-step verification modal.
   * If only the email is valid, it calls the handleSendOTP function with "email" as the parameter.
   * If only the mobile number is valid, it calls the handleSendOTP function with "sms" as the parameter.
   * If neither the email nor the mobile number is valid, it displays an error toast message.
   * If the user's account verification status is not 0 or their profile is
   */
  const handleValidate = () => {
    if (
      loginUserData.acc_verify_status === 0 &&
      loginUserData.is_profile_updated === 1
    ) {
      if (
        loginUserData.two_type_verification === 1 &&
        isValidData(loginUserData.email_id) &&
        isValidData(loginUserData.mobile)
      ) {
        dispatch(handletwostepVerifyModalshow(true));
      } else if (isValidData(loginUserData.email_id)) {
        handleSendOTP("email");
      } else if (isValidData(loginUserData.mobile)) {
        handleSendOTP("sms");
      } else {
        toast.error("Phone Number and Email ID Missing");
      }
    } else {
      navigate("/profile");
    }
  };

  return (
    <Modal centered open={open} closable={false} footer={null}>
      <div className={classes.profileModal}>
        <img
          height="38px"
          alt="Rawcaster"
          src={require("../../Assets/Images/png/rawcater_logo.png")}
        />
        <p>
          Your account needs to be validated before you can do any action in
          Rawcaster. Do you want to validate it now?
        </p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            onClick={() => {
              close();
            }}
            size="large"
            className={classes.cancelBtn}
          >
            Later
          </Button>
          <Button
            type="primary"
            onClick={() => {
              close();
              handleValidate();
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            Validate Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
