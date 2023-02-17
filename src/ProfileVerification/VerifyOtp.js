import { Button, Col } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useLocation } from "react-router-dom";
import {
  getSessionStorageData,
  removeSessionStorageData,
  setSessionStorageData,
} from "../Store/Storage";
import classes from "./Profilverification.module.css";

const VerifyOtp = () => {
  const { state } = useLocation();
  const [TimerValue, setTimerValue] = useState(state?.remaining_seconds || 60);

  let TimeVal = getSessionStorageData("verifyCountDown") || {
    counter: state?.remaining_seconds || 60,
    Date: new Date(),
  };

  function minTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function secondsToHms(d) {
    d = Number(d);
    let mDisplay = Math.floor((d % 3600) / 60);
    let sDisplay = Math.floor((d % 3600) % 60);
    return minTwoDigits(mDisplay) + ":" + minTwoDigits(sDisplay);
  }

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
        "verifyCountDown",
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

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ margin: "auto" }}>
      <div className="d-flex flex-column align-content-center justify-content-center mt-5">
        <div className={classes.centerLogo}>
          <Link to="/">
            <img src={require("../Assets/Images/png/rawcater_logo.png")} />
          </Link>
        </div>

        <div className={classes.verifybg}>
          <div className={classes.verifyBox}>
            <h1 className={classes.heading_h1}>Validate your {state?.type}</h1>
            <p className={classes.subText}>
              {" "}
              Please enter the One Time Password (OTP) sent to{" "}
              {/* <span>{getDisplayContent()}</span> */}
            </p>

            <p className={classes.label}>Enter OTP</p>

            <OtpInput
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
              >
                Resend code
              </p>
              <p className={classes.resendTxt}>{secondsToHms(TimerValue)}</p>
            </div>
            <div className="d-flex flex-row">
              <Button
                size="large"
                block
                className={classes.cancelBtn}
                htmlType="submit"
              >
                Cancel
              </Button>
              <Button
                size="large"
                block
                className={classes.validateBtn}
                htmlType="submit"
              >
                Validate
              </Button>
            </div>
          </div>

          <div className={`${classes.copyright} ${classes.verifyCopy}`}>
            <p>
              <img src={require("../Assets/Images/png/r_logo.png")} />
              © Copyright Rawcaster 2021
              <br />
              <Link to="/termsandconditions">Terms and Conditions</Link> |{" "}
              <Link to="/privacypolicy">Privacy Policy</Link> |{" "}
              <Link to="/cookiespolicy">Cookies Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default VerifyOtp;
