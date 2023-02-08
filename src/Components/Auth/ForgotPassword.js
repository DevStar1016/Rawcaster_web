import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  login_id: yup.string().required(`Please input your Login ID!`),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { values, handleChange, handleSubmit, setFieldValue, errors } =
    useFormik({
      initialValues: {
        login_id: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        navigate("/setpassword");
      },
    });
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
              <Form.Item name="login_id">
                <Input
                  className={classes.textBox}
                  placeholder="Enter your phone number or email address"
                  value={values.login_id}
                  onChange={handleChange("login_id")}
                  status={errors.login_id ? "error" : ""}
                  maxLength={50}
                  autoComplete="off"
                />
                <p className="ErrTxt">{errors?.login_id}</p>
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
