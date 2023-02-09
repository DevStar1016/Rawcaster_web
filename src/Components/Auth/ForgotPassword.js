import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { forgotPasswordService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";

const validationSchema = yup.object().shape({
  username: yup.string().required(`Please input your Login ID!`),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSendOTP(values);
    },
  });

  const HandleSendOTP = (values) => {
    let ForgotPasswordValues = {
      ...values,
      auth_code: getAuthToken(values.username),
    };
    forgotPasswordService(JSONtoformdata(ForgotPasswordValues))
      .then((res) => {
        if (res.data.status === 1) {
          navigate("/setpassword", {
            state: {
              otp_ref_id: res.data.otp_ref_id,
              remaining_seconds: res.data.remaining_seconds,
            },
          });
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
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link>
              <img
                className={classes.hideMob}
                src={require("../../Assets/Images/png/rawcater_logo.png")}
              />
            </Link>
            <h1 className={classes.heading_h1}> Forgot Password</h1>
            <p className={classes.subText}>
              Please enter your email address to search for your account
            </p>
            <Form
              name="rawcaster_forgot_password"
              autoComplete={"off"}
              onSubmitCapture={handleSubmit}
            >
              <p className={classes.label}>Login ID </p>
              <Form.Item name="username">
                <Input
                  className={classes.textBox}
                  placeholder="Enter your phone number or email address"
                  value={values.username}
                  onChange={handleChange("username")}
                  status={errors.username ? "error" : ""}
                  maxLength={50}
                  autoComplete="off"
                />
                <p className="ErrTxt">{errors?.username}</p>
              </Form.Item>

              <Form.Item>
                <Button block htmlType="submit" className={classes.btn}>
                  Send
                </Button>
              </Form.Item>
              <p className={classes.dntacc}>
                Already Registered?{" "}
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
                </Link> | <Link to="/privacypolicy">Privacy Policy</Link> |{" "}
                <Link to="/cookiespolicy">Cookies Policy</Link>
              </p>
            </div>
          </div>

          <div
            className={classes.goBackBtn}
            onClick={() => {
              navigate(-1);
            }}
          >
            <img
              className={classes.backBtn}
              src={require("../../Assets/Icons/png/Backbtn.png")}
            />
            Go Back
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

export default ForgotPassword;
