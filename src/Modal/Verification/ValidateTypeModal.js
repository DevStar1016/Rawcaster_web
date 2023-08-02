import { Modal } from "antd";
import React from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { resendOtpService } from "../../Services/ApiService";
import { useAuthData } from "../../Shared/Reduxfetcher";
import {
  getAuthToken,
  getPartialHiddenEmail,
  getPartialHiddenMobileNumber,
  JSONtoformdata,
} from "../../Shared/Utility";
import classes from "../Modal.module.css";

const ValidateTypeModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const loginUserData = useAuthData();

  const handleNavigate = (res, type) => {
    navigate("/verifyotp", { state: { type: type, ...res?.data } });
    window.location.reload();
  };

  const handleSendOTP = (type) => {
    let finalData = {
      auth_code: getAuthToken("Rawcaster"),
      token: loginUserData?.token,
      otp_flag: type,
    };

    resendOtpService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          handleNavigate(res, type);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };
  return (
    <Modal
      centered
      closable={true}
      open={open}
      footer={null}
      onCancel={() => {
        handleClose();
      }}
    >
      <div
        className={`${classes.profileModal} ${classes.veriyOptionContainer}`}
      >
        <img
          height="38px"
          alt="Rawcaster"
          src={require("../../Assets/Images/png/rawcater_logo.png")}
        />
        <h1 className={classes.heading_h1}>Choose the Verification Mode</h1>

        <div className={classes.veriyOptionSec}>
          {loginUserData &&
            loginUserData.email_id &&
            loginUserData.email_id !== "" && (
              <h3
                className={classes.heading_divider}
                onClick={() => {
                  handleClose();
                  handleSendOTP("email");
                }}
              >
                <span className="material-icons">mail_outline</span>
                Get a verification code at{" "}
                {getPartialHiddenEmail(loginUserData?.email_id)}
              </h3>
            )}
          {loginUserData &&
            loginUserData.mobile &&
            loginUserData.mobile !== "" && (
              <h3
                className={classes.heading_divider}
                onClick={() => {
                  handleClose();
                  handleSendOTP("sms");
                }}
              >
                <span className="material-icons">phone_iphone</span>
                Get a verification code at{" "}
                {getPartialHiddenMobileNumber(loginUserData?.mobile)}
              </h3>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default ValidateTypeModal;
