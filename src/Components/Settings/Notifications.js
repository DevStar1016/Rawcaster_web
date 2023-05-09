import { Switch } from "antd";
import React, { useState } from "react";
import classes from "./Settings.module.css";
import { NotificationTypes, switchTypes } from "./Constants";
import { useSettingsContext } from "../../Shared/Context";
import { useAuth } from "../../Shared/Reduxfetcher";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { resendOtpService } from "../../Services/ApiService";
import { useNavigate } from "react-router";
import RedirectModal from "../../Modal/Verification/RedirectModal";

const Notifications = () => {
  const { loginUserData } = useAuth();
  const navigate = useNavigate();
  const [redirectModal, setredirectModal] = useState({
    show: false,
    msg: "",
    type: "",
  });
  const { formikvalues, setupdateValue, updateValue } = useSettingsContext();

  const getValidData = (type) => {
    switch (type) {
      case 0:
        return "010";
      case 1:
        return "001";
      case 2:
        return "101";
      default:
        return "000";
    }
  };

  const handleNotification = (type, index, status) => {
    if (index === 0) {
      if (loginUserData?.is_email_id_verified === 0) {
        if (loginUserData?.email_id && loginUserData?.email_id !== "") {
          setredirectModal({
            show: true,
            msg: "Email id is not validated,Do you want to validate now?",
            type: "email",
          });

          return;
        }
      }
    } else if (index === 1) {
      if (loginUserData?.is_mobile_no_verified === 0) {
        if (loginUserData?.mobile && loginUserData?.mobile !== "") {
          setredirectModal({
            show: true,
            msg: "Mobile Number is not validated,Do you want to validate now?",
            type: "sms",
          });
          return;
        }
      }
    }
    if (status) {
      setupdateValue(type, getValidData(index));
    } else {
      setupdateValue(type, "000");
    }
  };

  const getDisabled = (index, type) => {
    if (index === 0) {
      if (loginUserData?.is_email_id_verified === 0) {
        if (loginUserData?.email_id && loginUserData?.email_id === "") {
          return;
        } else {
          return true;
        }
      }
    } else if (index === 1) {
      if (loginUserData?.is_mobile_no_verified === 0) {
        if (loginUserData?.mobile && loginUserData?.mobile !== "") {
          return;
        } else {
          return true;
        }
      }
    } else {
      return;
    }
  };

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
          navigate("/verifyotp", { state: { type: value, ...res.data } });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {});
  };

  return (
    <div>
      <h1>Notifications</h1>
      {formikvalues && (
        <>
          {NotificationTypes.map((ele, index) => {
            return (
              <div className={classes.item}>
                <p className={classes.smallheading}>{ele?.title}</p>
                <p className={classes.text}>{ele?.description}</p>
                {switchTypes.map((elem, i) => {
                  return (
                    <div className={classes.grp_switch}>
                      <Switch
                        size="small"
                        checked={elem.value === formikvalues[ele.type]}
                        disabled={getDisabled(i, ele.type)}
                        loading={updateValue.includes(ele.type)}
                        onChange={(e) => {
                          handleNotification(ele.type, i, e);
                        }}
                      />
                      {elem?.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      )}
      <RedirectModal
        open={redirectModal.show}
        msg={redirectModal.msg}
        closeBtnName="Later"
        Btnname={"Verify"}
        onSuccess={() => {
          handleSendOTP(redirectModal.type);
          setredirectModal({ show: false, msg: "", type: "" });
        }}
        onClose={() => {
          setredirectModal({ show: false, msg: "", type: "" });
        }}
      />
    </div>
  );
};

export default Notifications;
