/**
 * A React component that displays a settings page for managing notifications.
 * @returns JSX element
 */
import { Switch } from "antd";
import React, { useState } from "react";
import classes from "./Settings.module.css";
import {
  NotificationTypes,
  VALIDATION_MESSAGES,
  switchTypes,
} from "./Constants";
import { useSettingsContext } from "../../Shared/Context";
import { useAuth } from "../../Shared/Reduxfetcher";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { resendOtpService } from "../../Services/ApiService";
import { useNavigate } from "react-router";
import { HandleVerifyModal } from "../../Modal/DefaultModal";
import EmailorMobileUpdateModal from "../../Modal/Verification/EmailorMobileUpdateModal";

const Notifications = () => {
  const { loginUserData, userSettings } = useAuth();
  const navigate = useNavigate();
  const [OptinModal, setOptinModal] = useState({
    status: false,
    isEmail: false,
  });
  const { formikvalues, setupdateValue, updateValue } = useSettingsContext();

  /**
   * Returns a valid data string based on the given type.
   * @param {number} type - The type of data.
   * @returns {string} A valid data string.
   */
  const getValidData = (nuggetType, type, value) => {
    let SwitchType = formikvalues[nuggetType]?.split("");
    SwitchType[type] = value;
    return SwitchType?.join("");
  };

  /**
   * Handles the process of sending an OTP (One-Time Password) for verification.
   * @param {any} value - The value indicating the type of OTP to send.
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
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          navigate("/verifyotp", {
            state: { navigatePath: "/setting", type: value, ...res.data },
          });
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.message, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Handles the notification based on the given type, index, and status.
   * @param {string} type - The type of notification.
   * @param {number} index - The index of the notification.
   * @param {boolean} status - The status of the notification.
   * @returns None
   */

  const handleNotification = (type, index, status) => {
    if (index === 0) {
      if (loginUserData?.is_email_id_verified === 0) {
        HandleVerifyModal({
          SubmitButtonTitle: "Verify",
          closeButtonTitle: "Later",
          primary: "success",
          onSuccess: () => {
            if (loginUserData.email_id) {
              handleSendOTP("email");
            } else {
              setOptinModal({
                status: true,
                isEmail: true,
              });
            }
          },
          message: VALIDATION_MESSAGES.EMAIL_NOT_VERIFIED,
        });

        return;
      } else {
      }
    } else if (index === 1) {
      if (loginUserData?.is_mobile_no_verified === 0) {
        HandleVerifyModal({
          SubmitButtonTitle: "Verify",
          closeButtonTitle: "Later",
          primary: "success",
          onSuccess: () => {
            if (loginUserData.mobile) {
              handleSendOTP("sms");
            } else {
              setOptinModal({
                status: true,
                isEmail: false,
              });
            }
          },
          message: VALIDATION_MESSAGES.MOBILE_NUMBER_NOT_VERIFIED,
        });
        return;
      }
    }
    if (status) {
      if (userSettings.opt_in) {
        setupdateValue(type, getValidData(type, index, "1"), "add", false);
      } else {
        HandleVerifyModal({
          SubmitButtonTitle: "Confirm",
          closeButtonTitle: "Cancel",
          primary: "success",
          onSuccess: () => {
            setupdateValue(
              "opt_in_with_notification_sms",
              {
                opt_in: 1,
                [type]: getValidData(type, index, "1"),
              },
              "add_multiple"
            );
          },
          message: VALIDATION_MESSAGES.OPT_IN_ENABLE,
        });
      }
    } else {
      setupdateValue(type, getValidData(type, index, "0"), "add", false);
    }
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
                  const getChecked = () => {
                    return (
                      formikvalues[ele.type]?.toString()?.split("")[i] === "1"
                    );
                  };
                  return (
                    <div className={classes.grp_switch}>
                      <Switch
                        size="small"
                        // checked={elem.value === formikvalues[ele.type]}
                        checked={getChecked()}
                        // disabled={getDisabled(i, ele.type)}
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
      {OptinModal.status && (
        <EmailorMobileUpdateModal
          open={OptinModal.status}
          type={OptinModal.isEmail ? "email_id" : "mobile"}
          close={() => {
            setOptinModal({
              status: false,
              isEmail: false,
            });
          }}
        />
      )}
    </div>
  );
};

export default Notifications;
