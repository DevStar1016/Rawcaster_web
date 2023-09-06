import { Button, Col } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getSessionStorageData,
  removeSessionStorageData,
  setCookieData,
  setSessionStorageData,
} from "../../../Store/Storage";
import classes from "./Profilverification.module.css";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import {
  resendOtpService,
  signupVerifyService,
} from "../../../Services/ApiService";
import { getAuthToken, JSONtoformdata } from "../../../Shared/Utility";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { handleLoading } from "../../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";
import moment from "moment";
import VerifiedModal from "../../../Modal/Verification/VerifiedModal";
import { fetchuserInfobyToken } from "../../../Store/Redux/Action";

const validationSchema = yup.object().shape({
  otp: yup
    .string()
    .min(6, "Please Enter Valid OTP!")
    .required(`Please input your OTP!`),
});

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const loginToken = useAuthToken();
  const userData = useAuthData();
  const [TimerValue, setTimerValue] = useState(state?.remaining_seconds || 60);
  const [otpRefId, setotpRefId] = useState();
  const [verifiedModalShow, setverifiedModalShow] = useState(false);

  let TimeVal = getSessionStorageData("verifyCountDown") || {
    counter: state?.remaining_seconds || 60,
    Date: new Date(),
  };

  function minTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  /**
   * useEffect hook that updates the otpRefId state variable if it is not already set.
   * It checks if otpRefId is falsy and if so, sets it to the value of state?.otp_ref_id.
   * @param {object} state - The state object that contains the otp_ref_id value.
   * @returns None
   */
  useEffect(() => {
    if (!otpRefId) {
      setotpRefId(state?.otp_ref_id);
    }
  }, [state]);

  /**
   * Converts a number of seconds to a formatted string in the format "mm:ss".
   * @param {number} d - The number of seconds to convert.
   * @returns {string} The formatted time string.
   */
  function secondsToHms(d) {
    d = Number(d);
    let mDisplay = Math.floor((d % 3600) / 60);
    let sDisplay = Math.floor((d % 3600) % 60);
    return minTwoDigits(mDisplay) + ":" + minTwoDigits(sDisplay);
  }

  /**
   * useEffect hook that updates the timer value based on the difference between the current time
   * and the stored time value. It also updates the session storage data with the updated timer value.
   * @returns None
   */
  useEffect(() => {
    let finalTimeVal;
    try {
      finalTimeVal = JSON.parse(TimeVal);
    } catch (error) {
      finalTimeVal = TimeVal;
    }

    if (finalTimeVal && finalTimeVal.counter) {
      const difference = moment(
        new Date() - new Date(finalTimeVal.Date)
      ).format("ss");

      setTimerValue(finalTimeVal.counter - difference);
      setSessionStorageData(
        "verifyCountDown",
        JSON.stringify({
          counter: finalTimeVal.counter - difference,
          Date: new Date(),
        })
      );
    }
  }, []);

  const handleContinue = (token = loginToken) => {
    dispatch(fetchuserInfobyToken(token)).then(({ payload }) => {
      if (state?.navigatePath) {
        // navigate(state?.navigatePath);
        window.location.assign(state?.navigatePath);
      } else {
        window.location.assign("/dashboard");
        // navigate("/dashboard");
      }
      setverifiedModalShow(false);
    });
  };

  /**
   * Executes a side effect when the TimerValue changes.
   * Starts a countdown timer and updates the TimerValue every second.
   * Stores the countdown value and current date in session storage.
   * Clears the session storage and stops the timer when the countdown reaches 0.
   * @returns None
   */
  useEffect(() => {
    let timer;
    if (TimerValue > 0) {
      timer = setInterval(() => {
        let val = TimerValue - 1;
        setTimerValue(val);

        setSessionStorageData(
          "verifyCountDown",
          JSON.stringify({
            counter: val,
            Date: new Date(),
          })
        );
      }, 1000);
    } else {
      removeSessionStorageData("verifyCountDown");
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [TimerValue]);

  /**
   * Handles the resend OTP functionality.
   * @returns None
   */
  const handleresendOTP = () => {
    let ResendValues = {
      otp_ref_id: otpRefId,
      auth_code: getAuthToken(otpRefId),
      otp_flag: "email",
    };
    resendOtpService(JSONtoformdata(ResendValues))
      .then((res) => {
        if (res.data.status === 1) {
          setTimerValue(res.data.remaining_seconds);
          setSessionStorageData(
            "verifyCountDown",
            JSON.stringify({
              counter: res.data.remaining_seconds,
              Date: new Date(),
            })
          );
          setotpRefId(res.data.otp_ref_id);
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  const { values, handleChange, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: (values) => {
      HandlesubmitVerify(values);
    },
  });

  /**
   * Handles the submission of a verification form.
   * @param {object} values - The form values submitted by the user.
   * @returns None
   */
  const HandlesubmitVerify = (values) => {
    dispatch(handleLoading(true));
    let ResetPasswordValue = {
      ...values,
      otp_flag: state?.type,
      alt_token_id: state?.alt_token_id,
      otp_ref_id: otpRefId,
      auth_code: getAuthToken(otpRefId),
    };
    signupVerifyService(JSONtoformdata(ResetPasswordValue))
      .then((res) => {
        if (res.data.status === 1) {
          if (userData?.acc_verify_status === 0) {
            setverifiedModalShow(true);
          } else {
            if (res.data.token) {
              setCookieData("rawcaster_user_token", res.data);
            }
            handleContinue(res.data.token);
          }
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {
        toast.remove("rawcaster");
        toast.error(err.message, { id: "rawcaster" });
      })
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ margin: "auto" }}>
      <div className="d-flex flex-column align-content-center justify-content-center">
        <div className={classes.centerLogo}>
          <Link to="/">
            <img
              alt="Rawcaster"
              src={require("../../../Assets/Images/png/rawcater_logo.png")}
            />
          </Link>
        </div>

        <div className={classes.verifybg}>
          <div className={classes.verifyBox}>
            <h1 className={classes.heading_h1}>Validate your {state?.type}</h1>
            <p className={classes.subText}> {state?.msg}</p>

            <p className={classes.label}>Enter OTP</p>

            <OtpInput
              value={values.otp}
              onChange={handleChange("otp")}
              numInputs={6}
              className={classes.otpInput}
              inputStyle={{
                height: "50px",
                width: "100%",
                border: "none",
                borderRadius: "20px",
                borderRadius: "8px",
                marginTop: "1px",
              }}
              containerStyle={{ margin: "10px 0 0 0" }}
              separator={<span>{""}</span>}
            />
            <div className="d-flex flex-row justify-content-between">
              <p
                className={
                  TimerValue === 0 ? classes.activeresendTxt : classes.resendTxt
                }
                onClick={() => {
                  if (TimerValue === 0) {
                    handleresendOTP();
                  }
                }}
              >
                Resend code
              </p>
              <p className={classes.resendTxt}>{secondsToHms(TimerValue)}</p>
            </div>
            {touched.otp && <p className="ErrTxt mb-3">{errors?.otp}</p>}
            <div className="d-flex flex-row">
              <Button
                size="large"
                block
                className={classes.cancelBtn}
                htmlType="submit"
                onClickCapture={() => {
                  navigate("/dashboard");
                }}
              >
                Cancel
              </Button>
              <Button
                size="large"
                block
                className={classes.validateBtn}
                onClickCapture={() => {
                  handleSubmit();
                }}
                htmlType="submit"
              >
                Validate
              </Button>
            </div>
          </div>

          <div className={`${classes.copyright} ${classes.verifyCopy}`}>
            <p>
              <img
                alt="Rawcaster"
                src={require("../../../Assets/Images/png/r_logo.png")}
              />
              © Copyright Rawcaster 2021
              <br />
              <Link to="/termsandconditions">Terms and Conditions</Link> |{" "}
              <Link to="/privacypolicy">Privacy Policy</Link> |{" "}
              <Link to="/cookiespolicy">Cookies Policy</Link>
            </p>
          </div>
        </div>
      </div>
      <VerifiedModal
        open={verifiedModalShow}
        onClose={() => {
          setverifiedModalShow(false);
        }}
        onSuccess={() => {
          handleContinue();
          setverifiedModalShow(false);
        }}
      />
    </Col>
  );
};

export default VerifyOtp;
