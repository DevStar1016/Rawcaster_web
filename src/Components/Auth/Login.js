import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import RedirectModal from "../../Modal/RedirectModal";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { loginService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { PASSWORD_EXP } from "../../Shared/Constant";

const validationSchema = yup.object().shape({
  username: yup.string().required(`Please input your Login ID!`),
  password: yup
    .string()
    .matches(
      PASSWORD_EXP,
      "Your password to be at least 8 characters long, contain uppercase letter (A-Z), lowercase letter (a-z), symbol (!@#$%) and a number (0-9)."
    )
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
});

const Login = () => {
  const navigate = useNavigate();
  const [redirectModal, setredirectModal] = useState({ show: false, msg: "" });
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleLoginService(values);
    },
  });

  const HandleLoginService = (values) => {
    let loginData = {
      ...values,
      auth_code: getAuthToken(values.username),
    };
    loginService(JSONtoformdata(loginData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
        } else if (res.data.status === 0) {
          setredirectModal({ show: true, msg: res.data.msg });
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
              <Form.Item name="username">
                <Input
                  className={classes.textBox}
                  placeholder="Email or Phone Number"
                  value={values.username}
                  onChange={handleChange("username")}
                  status={touched.username && errors.username ? "error" : ""}
                  maxLength={50}
                  autoComplete="off"
                />
                {touched.username && (
                  <p className="ErrTxt">{errors?.username}</p>
                )}
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
                  status={touched.password && errors.password ? "error" : ""}
                  onChange={handleChange("password")}
                />
                {touched.password && (
                  <p className="ErrTxt">{errors?.password}</p>
                )}
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
      <RedirectModal
        open={redirectModal.show}
        msg={redirectModal.msg}
        Btnname={"Sign up"}
        onSuccess={() => {
          navigate("/signup");
          setredirectModal({ show: false, msg: "" });
        }}
        onClose={() => {
          setredirectModal({ show: false, msg: "" });
        }}
      />
    </>
  );
};

export default Login;
