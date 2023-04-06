import { Switch } from "antd";
import React from "react";
import classes from "./Settings.module.css";
import { NotificationTypes, switchTypes } from "./Constants";
import { useSettingsContext } from "../../Shared/Context";
import { useAuth } from "../../Shared/Reduxfetcher";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { resendOtpService } from "../../Services/ApiService";
import { useNavigate } from "react-router";

const Notifications = () => {
  const { loginUserData } = useAuth();
  const navigate = useNavigate();
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
    if (index === 1) {
      if (loginUserData?.is_email_id_verified === 0) {
        if (loginUserData?.email_id && loginUserData?.email_id !== "") {
          console.log("email not validated");
          // handleSendOTP("email");
          return;
        }
      }
    } else if (index === 2) {
      if (loginUserData?.is_mobile_no_verified === 0) {
        if (loginUserData?.mobile && loginUserData?.mobile !== "") {
          console.log("mobile number not validated");
          // handleSendOTP("sms");

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
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className={classes.contentSec} style={{ display: "block" }}>
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
    </div>
  );
};

export default Notifications;
