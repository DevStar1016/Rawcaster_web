import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import OtpInput from "react-otp-input";
import dayjs from "dayjs";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  otp: yup
    .string()
    .min(6, "Please Enter Valid OTP!")
    .required(`Please input your OTP!`),
  new_password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
  confirm_password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  let TimeVal = window.sessionStorage.getItem("CountDown") || {
    counter: 60,
    Date: new Date(),
  };
  const [TimerValue, setTimerValue] = useState(60);
  const { values, setFieldValue, handleChange, handleSubmit, errors } =
    useFormik({
      initialValues: {
        otp: "",
        new_password: "",
        confirm_password: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        navigate("/login");
      },
    });

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
      window.sessionStorage.setItem(
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

        window.sessionStorage.setItem(
          "CountDown",
          JSON.stringify({
            counter: val,
            Date: new Date(),
          })
        );
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [TimerValue]);

  function secondsToHms(d) {
    d = Number(d);

    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var mDisplay = m > 0 ? m : "00";
    var sDisplay = s > 0 ? s : "00";
    return mDisplay + ":" + sDisplay;
  }

  return (
    <>
      <div className={classes.loginbg}>
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link>
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
                    height: "52px",
                    width: "53px",
                    border: "1px solid #E8EAEE",
                    borderRadius: "8px",
                  }}
                  containerStyle={{ margin: "10px 0 0 0" }}
                  separator={<span>{""}</span>}
                />
                <div className="d-flex flex-row justify-content-between">
                  <p className={classes.resendTxt}>Resend code</p>
                  <p className={classes.resendTxt}>
                    {secondsToHms(TimerValue)}
                  </p>
                </div>
              </div>
              <p className="ErrTxt mb-1">{errors?.otp}</p>
              <p className={classes.label}>Password </p>
              <Form.Item>
                <Input
                  className={classes.textBox}
                  placeholder="Enter your password"
                  value={values.new_password}
                  onChange={handleChange("new_password")}
                  status={errors.new_password ? "error" : ""}
                  maxLength={50}
                  autoComplete="off"
                />
                <p className="ErrTxt">{errors?.new_password}</p>
              </Form.Item>
              <p className={classes.label}>Confirm your password</p>
              <Form.Item>
                <Input
                  className={classes.textBox}
                  placeholder="Enter your  password"
                  value={values.confirm_password}
                  onChange={handleChange("confirm_password")}
                  status={errors.confirm_password ? "error" : ""}
                  maxLength={50}
                  autoComplete="off"
                />
                <p className="ErrTxt">{errors?.confirm_password}</p>
              </Form.Item>
              <Form.Item>
                <Button block htmlType="submit" className={classes.btn}>
                  Send
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

        <div className={classes.sliderSec}>
          <div className={classes.contentBox}>
            <img src={SigninImg} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
