import { Modal } from "antd";
import React from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { resendOtpService } from "../Services/ApiService";
import { useAuthData } from "../Shared/Reduxfetcher";
import {
  getAuthToken,
  getPartialHiddenEmail,
  getPartialHiddenMobileNumber,
  JSONtoformdata,
} from "../Shared/Utility";
import classes from "./Modal.module.css";

const ValidateTypeModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const loginUserData = useAuthData();

  const handleSendOTP = (type = 1) => {
    let finalData = {
      auth_code: getAuthToken("Rawcaster"),
      token: loginUserData?.token,
    };
    resendOtpService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);

          navigate("/verifyotp", { state: { ...res.data } });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <Modal closable={false} open={open} footer={null}>
      <div
        className={`${classes.profileModal} ${classes.veriyOptionContainer}`}
      >
        <img
          height="38px"
          src={require("../Assets/Images/png/rawcater_logo.png")}
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
                  handleSendOTP(1);
                }}
              >
                <span class="material-icons">mail_outline</span>
                Get a verification code at{" "}
                {getPartialHiddenEmail(loginUserData?.email)}
              </h3>
            )}
          {loginUserData &&
            loginUserData.mobile &&
            loginUserData.mobile !== "" && (
              <h3
                className={classes.heading_divider}
                onClick={() => {
                  handleClose();
                  handleSendOTP(2);
                }}
              >
                <span class="material-icons">phone_iphone</span>
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
