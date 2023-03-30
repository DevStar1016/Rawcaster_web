import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import forgotImg from "../../Assets/Images/png/forgot-password.png";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import OtpInput from "react-otp-input";
import dayjs from "dayjs";
import * as yup from "yup";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import {
  resendOtpService,
  verifyotpsendPasswordService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { PASSWORD_EXP } from "../../Shared/Constant";
import {
  getSessionStorageData,
  removeSessionStorageData,
  setSessionStorageData,
} from "../../Store/Storage";

const validationSchema = yup.object().shape({
  otp: yup
    .string()
    .min(6, "Please Enter Valid OTP!")
    .required(`Please input your OTP!`),
  new_password: yup
    .string()
    // .matches(
    //   PASSWORD_EXP,
    //   "Your password to be at least 8 characters long, contain uppercase letter (A-Z), lowercase letter (a-z), symbol (!@#$%) and a number (0-9)."
    // )
    .trim("The Password cannot include leading and trailing spaces")
    .strict(true)
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
  confirm_password: yup
    .string()
    // .matches(
    //   PASSWORD_EXP,
    //   "Your password to be at least 8 characters long, contain uppercase letter (A-Z), lowercase letter (a-z), symbol (!@#$%) and a number (0-9)."
    // )
    .trim("The Password cannot include leading and trailing spaces")
    .strict(true)
    .min(8, "Password must be at least 8 characters long")
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Please input your Password!"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  let TimeVal = getSessionStorageData("CountDown") || {
    counter: state?.remaining_seconds,
    Date: new Date(),
  };
  const [TimerValue, setTimerValue] = useState(state?.remaining_seconds || 60);
  const [otpRefId, setotpRefId] = useState();
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandlesubmitResetPassword(values);
    },
  });
  useEffect(() => {
    if (!otpRefId) {
      setotpRefId(state?.otp_ref_id);
    }
  }, [state]);

  const HandlesubmitResetPassword = (values) => {
    let ResetPasswordValue = {
      ...values,
      otp_ref_id: otpRefId,
      auth_code: getAuthToken(otpRefId),
    };
    verifyotpsendPasswordService(JSONtoformdata(ResetPasswordValue))
      .then((res) => {
        if (res.data.status === 1) {
          navigate("/login");
          toast.success(res.data.msg);
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    let finalTimeVal;
    try {
      finalTimeVal = JSON.parse(TimeVal);
    } catch (error) {
      finalTimeVal = TimeVal;
    }

    if (finalTimeVal && finalTimeVal.counter) {
      const difference = dayjs(new Date() - new Date(finalTimeVal.Date)).format(
        "ss"
      );

      setTimerValue(finalTimeVal.counter - difference);
      setSessionStorageData(
        "CountDown",
        JSON.stringify({
          counter: finalTimeVal.counter - difference,
          Date: new Date(),
        })
      );
    }
  }, []);

  useEffect(() => {
    let timer;
    if (TimerValue > 0) {
      timer = setInterval(() => {
        let val = TimerValue - 1;
        setTimerValue(val);

        setSessionStorageData(
          "CountDown",
          JSON.stringify({
            counter: val,
            Date: new Date(),
          })
        );
      }, 1000);
    } else {
      removeSessionStorageData("CountDown");
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [TimerValue]);

  function minTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function secondsToHms(d) {
    d = Number(d);
    let mDisplay = Math.floor((d % 3600) / 60);
    let sDisplay = Math.floor((d % 3600) % 60);
    return minTwoDigits(mDisplay) + ":" + minTwoDigits(sDisplay);
  }

  const handleresendOTP = () => {
    let ResendValues = {
      otp_ref_id: otpRefId,
      auth_code: getAuthToken(otpRefId),
    };
    resendOtpService(JSONtoformdata(ResendValues))
      .then((res) => {
        if (res.data.status === 1) {
          setTimerValue(res.data.remaining_seconds);
          setSessionStorageData(
            "CountDown",
            JSON.stringify({
              counter: res.data.remaining_seconds,
              Date: new Date(),
            })
          );
          setotpRefId(res.data.otp_ref_id);
          toast.success(res.data.msg);
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <>
      <div className={classes.loginbg}>
        <div className={classes.mobHeader}>
          <Link to="/">
            <img src={mainlogowhite} />
          </Link>
        </div>
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link to="/">
              <img
                className={classes.hideMob}
                src={require("../../Assets/Images/png/rawcater_logo.png")}
              />
            </Link>
            <h1 className={classes.heading_h1}>Reset Password</h1>
            <p className={classes.subText}>
              A one time passcode (OTP) has been sent to the email address you
              provided
            </p>
            <Form
              name="rawcaster_reset_password"
              autoComplete={"off"}
              onSubmitCapture={handleSubmit}
            >
              <p className={classes.label}>Enter OTP </p>
              <div className="w-100 my-2">
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
                      TimerValue === 0
                        ? classes.activeresendTxt
                        : classes.resendTxt
                    }
                    onClick={() => {
                      if (TimerValue === 0) {
                        handleresendOTP();
                      }
                    }}
                  >
                    Resend code
                  </p>
                  <p className={classes.resendTxt}>
                    {secondsToHms(TimerValue)}
                  </p>
                </div>
              </div>
              {touched.otp && <p className="ErrTxt mb-1">{errors?.otp}</p>}
              <p className={classes.label}>Password </p>
              <Form.Item>
                <Input.Password
                  className={classes.textBox}
                  placeholder="Enter your password"
                  value={values.new_password}
                  onChange={handleChange("new_password")}
                  status={
                    touched.new_password && errors.new_password ? "error" : ""
                  }
                  maxLength={50}
                  autoComplete="new_password"
                />
                {touched.new_password && (
                  <p className="ErrTxt">{errors?.new_password}</p>
                )}
              </Form.Item>
              <p className={classes.label}>Confirm your password</p>
              <Form.Item>
                <Input.Password
                  className={classes.textBox}
                  placeholder="Enter your  password"
                  value={values.confirm_password}
                  onChange={handleChange("confirm_password")}
                  status={
                    touched.confirm_password && errors.confirm_password
                      ? "error"
                      : ""
                  }
                  maxLength={50}
                  autoComplete="new_password"
                />
                {touched.confirm_password && (
                  <p className="ErrTxt">{errors?.confirm_password}</p>
                )}
                <span className={classes.hintTxt}>
                  We recommend your password to be at least 8 characters long,
                  contain uppercase letter (A-Z), lowercase letter (a-z), symbol
                  (!@#$%) and a number (0-9).
                </span>
              </Form.Item>

              <Form.Item className="mt-2">
                <Button block htmlType="submit" className={classes.btn}>
                  Submit
                </Button>
              </Form.Item>
              <p className={classes.dntacc}>
                Already Registered?
                <span>
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </Form>

            <div className={classes.copyright}>
              <img src={RawcasterLogo} />
              <p>
                © Copyright Rawcaster 2021
                <br />
                <Link to="/termsandconditions">
                  Terms and Conditions
                </Link> | <Link to="/privacypolicy">Privacy Policy</Link> |
                <Link to="/cookiespolicy">Cookies Policy</Link>
              </p>
            </div>
          </div>
        </div>

        <div className={`${classes.sliderSec} ${classes.nopad}`}>
          <div className={classes.rSec}>
            <div className={classes.contentBox}>
              <img src={forgotImg} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
