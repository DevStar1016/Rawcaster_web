import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import mainlogo from "../../Assets/Images/svg/rawcaster_logo.svg";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import { useFormik } from "formik";
import * as yup from "yup";
import RedirectModal from "../../Modal/RedirectModal";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { loginService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";
import { setCookieData, setLocalStorageData } from "../../Store/Storage";
import OwlCarousel from "react-owl-carousel";
import { handleprofileVerifyModalShow } from "../../Store/Redux/Reducer/DashboardReducer";
import { getProfile } from "./getProfile";

const validationSchema = yup.object().shape({
  username: yup.string().required(`Please input your Login ID!`),
  password: yup
    .string()
    // .matches(
    //   PASSWORD_EXP,
    //   "Your password to be at least 8 characters long, contain uppercase letter (A-Z), lowercase letter (a-z), symbol (!@#$%) and a number (0-9)."
    // )
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [redirectModal, setredirectModal] = useState({ show: false, msg: "" });
  const { values, handleChange, handleSubmit, errors, touched, setFieldError } =
    useFormik({
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
          getProfile(res.data.token, dispatch);
          navigate("/dashboard");
        } else if (res.data.status === 2) {
          setredirectModal({ show: true, msg: res.data.msg });
        } else if (res.data.status === 0) {
          setFieldError("username", res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const carouselOptions = {
    items: 1,
    nav: false,
    loop: true,
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
              <img className={classes.hideMob} src={mainlogo} />
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
              </Form.Item>
              {touched.password && <p className="ErrTxt">{errors?.password}</p>}
              <Form.Item>
                <div className={`fwgpsw ${classes.fwgpsw}`}>
                  <div className={classes.right}>
                    <NavLink to="/forgotpassword"> Forgot Password?</NavLink>
                  </div>
                </div>
              </Form.Item>
              <Form.Item>
                <Button block htmlType="submit" className={classes.btn}>
                  Login
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

        <div className={`${classes.sliderSec} login_carosel`}>
          <OwlCarousel className={"owl-theme "} {...carouselOptions}>
            <div className={classes.contentBox}>
              <img src={SigninImg} />
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <img src={SigninImg} />
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <img src={SigninImg} />
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
          </OwlCarousel>
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
