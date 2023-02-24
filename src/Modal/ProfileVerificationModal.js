import { Button, Modal } from "antd";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { resendOtpService } from "../Services/ApiService";
import { useAuthData } from "../Shared/Reduxfetcher";
import { getAuthToken, isValidData, JSONtoformdata } from "../Shared/Utility";
import { handletwostepVerifyModalshow } from "../Store/Redux/Reducer/DashboardReducer";
import classes from "./Modal.module.css";

export const VerificationModal = ({ open, close }) => {
  const loginUserData = useAuthData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
    <Modal open={open} closable={false} footer={null}>
      <div className={classes.profileModal}>
        <img
          height="38px"
          src={require("../Assets/Images/png/rawcater_logo.png")}
        />
        <p>
          You need to complete your account validation before you can do this.
          Do you want to validate it now?
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
