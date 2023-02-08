import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import classes from "./Signup.module.css";
import SignupwithMobileImg from "../../Assets/Images/png/signupwithmobile-intro.png";
import SignupwithEmailImg from "../../Assets/Images/png/signupwithemail-intro.png";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import * as yup from "yup";
import { useFormik } from "formik";
import { EMAIL_REGEX } from "../../Shared/Constant";

const SignupwithCredentials = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getLoginType = () => {
    if (pathname.includes("signupwithemail")) {
      return {
        id: 1,
        title: "Email",
        instead: "Phone Number",
        pathname: "/signupwithmobile",
        image: SignupwithMobileImg,
      };
    } else {
      return {
        id: 2,
        title: "Phone Number ",
        instead: "Email",
        pathname: "/signupwithemail",
        image: SignupwithEmailImg,
      };
    }
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(50, "Name cannot be longer than 50 characters")
      .required("Please input your Name!"),
    login_id: yup
      .string()
      .matches(
        getLoginType().id === 1 ? EMAIL_REGEX : "",
        `Please Enter Valid ${getLoginType().title}!`
      )
      .required(`Please input your ${getLoginType().title}!`),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .required("Please input your Password!"),
    date_of_birth: yup.string().required("Please input your Date of Birth!"),
  });

  const { values, handleChange, handleSubmit, setFieldValue, errors } =
    useFormik({
      initialValues: {
        name: "",
        login_id: "",
        password: "",
        date_of_birth: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        console.log(values);
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
            <h1 className={classes.heading_h1}>Join Rawcaster Family</h1>
            <p className={classes.subText}>
              Join now to access the latest insights, experience for your social
              media performance.
            </p>
            <Form
              name="rawcaster_signup"
              autoComplete="off"
              onSubmitCapture={handleSubmit}
            >
              <p className={classes.label}>Name</p>
              <Form.Item name="name">
                <Input
                  className={classes.textBox}
                  placeholder="Enter your name"
                  autoComplete="off"
                  value={values.name}
                  onChange={handleChange("name")}
                  maxLength={50}
                  status={errors.name ? "error" : ""}
                />
                <p className="ErrTxt">{errors?.name}</p>
              </Form.Item>
              <p className={classes.label}>{getLoginType().title}</p>
              <Form.Item name="login_id">
                <Input
                  className={classes.textBox}
                  placeholder={`Enter your ${getLoginType().title}`}
                  autoComplete="off"
                  value={values.login_id}
                  onChange={handleChange("login_id")}
                  maxLength={50}
                  status={errors.login_id ? "error" : ""}
                />
                <div className="d-flex flex-row justify-content-between">
                  <p className="ErrTxt">{errors?.login_id}</p>
                  <p
                    className={classes.changeTxt}
                    onClick={() => {
                      navigate(getLoginType().pathname);
                    }}
                  >
                    Use {getLoginType().instead} Instead
                  </p>
                </div>
              </Form.Item>

              <p className={classes.label}>Password</p>
              <span className={classes.hintTxt}>
                We recommend your password to be at least 8 characters long,
                contain uppercase letter (A-Z), lowercase letter (a-z), symbol
                (!@#$%) and a number (0-9).
              </span>
              <Form.Item name="password" className="pt-2">
                <Input.Password
                  className={classes.textBox}
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={values.password}
                  maxLength={50}
                  status={errors.password ? "error" : ""}
                  onChange={handleChange("password")}
                />
                <p className="ErrTxt">{errors?.password}</p>
              </Form.Item>
              <p className={classes.label}>Date of Birth</p>
              <Form.Item>
                <DateInputBox
                  value={values.date_of_birth}
                  status={errors.date_of_birth ? "error" : ""}
                  onSelectDate={(date) => {
                    setFieldValue("date_of_birth", date);
                  }}
                />
                <p className="ErrTxt">{errors?.date_of_birth}</p>
              </Form.Item>
              <Form.Item>
                <Button block htmlType="submit" className={classes.btn}>
                  Join Rawcaster Family
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
                </Link> | <Link to="/privacypolicy">Privacy Policy</Link> |{" "}
                <Link to="/cookiespolicy">Cookies Policy</Link>
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${classes.sliderSec} ${classes.rightSec} ${classes.signupSec}`}
        >
          <div className={classes.contentBox}>
            <div className={classes.signupImgSec}>
              <img src={getLoginType().image} />
            </div>
            <h2>Connect Share Express</h2>
            <h4>
              with Rawcaster Influencers, bloggers, writers, photographers can
              collaborate with their fans easily
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupwithCredentials;
