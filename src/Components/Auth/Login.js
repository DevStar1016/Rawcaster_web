import { Button, Form, Input } from "antd";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  login_id: yup.string().required(`Please input your Login ID!`),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
});

const Login = () => {
  const { values, handleChange, handleSubmit, setFieldValue, errors } =
    useFormik({
      initialValues: {
        login_id: "",
        password: "",
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
            <h1 className={classes.heading_h1}> Welcome to Rawcaster</h1>
            <p className={classes.subText}>
              Log in now to access the latest insights, experience for your
              social media performance.
            </p>
            <Form
              name="rawcaster_login"
              autoComplete={"off"}
              onSubmitCapture={handleSubmit}
            >
              <p className={classes.label}>Login ID </p>
              <Form.Item name="login_id">
                <Input
                  className={classes.textBox}
                  placeholder="Email or Phone Number"
                  value={values.login_id}
                  onChange={handleChange("login_id")}
                  status={errors.login_id ? "error" : ""}
                  maxLength={50}
                  autoComplete="off"
                />
                <p className="ErrTxt">{errors?.login_id}</p>
              </Form.Item>
              <p className={classes.label}>Password</p>
              <Form.Item name="password">
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
              <Form.Item>
                <div className={`fwgpsw ${classes.fwgpsw}`}>
                  <div className={classes.right}>
                    <NavLink to="/forgotpassword"> Forgot Password?</NavLink>
                  </div>
                </div>
              </Form.Item>
              <Form.Item>
                <Button block htmlType="submit" className={classes.btn}>
                  Sign in
                </Button>
              </Form.Item>
              <p className={classes.dntacc}>
                Not registered yet?{" "}
                <span>
                  <Link to="/signup">Create an Account</Link>
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

        <div className={classes.sliderSec}>
          <div className={classes.contentBox}>
            <img src={SigninImg} />
            <h2>Post Nuggets</h2>
            <h4>
              These are small pieces or tidbit of thoughts in your mind or an
              image (video or picture) that you want to share with one or more
              connected persons.
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
