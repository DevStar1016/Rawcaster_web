/**
 * A functional component that represents the login page of the application.
 * Allows users to log in with their credentials and access the latest insights and experiences for their social media performance.
 * @returns JSX elements representing the login page.
 */
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import classes from "./Signup.module.css";
import SigninImg from "../../Assets/Images/svg/signin-intro.png";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import mainlogo from "../../Assets/Images/svg/rawcaster_logo.svg";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { loginService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  getSessionStorageData,
  removeSessionStorageData,
  setCookieData,
} from "../../Store/Storage";
import OwlCarousel from "react-owl-carousel";
import Seo from "../SEO/Seo";
import RedirectModal from "../../Modal/Verification/RedirectModal";
import SigninwithService from "./SigninwithService";
import { accountVerifyHandle } from "./Utility";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { fetchuserInfobyToken } from "../../Store/Redux/Action";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../Shared/Constant";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, "Email or Phone Number Must be atleast 5 Characters")
    .required(`Please input your Email or Phone Number!`),
  password: yup
    .string()
    .trim("The Password cannot include leading and trailing spaces")
    .strict(true)
    .min(8, "Password must be at least 8 characters long")
    .required("Please input your Password!"),
});

const Login = () => {
  const { nugget_id } = useParams();
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
        dispatch(handleLoading(true));
        HandleLoginService(values);
      },
    });

  /**
   * Handles the profile update based on the given type.
   * @param {object} res - The response object.
   * @param {number} type - The type of profile update (1 for email, 2 for sms).
   * @returns None
   */
  const handleProfileUpdate = (res, type) => {
    if (type === 1) {
      accountVerifyHandle(res, "email", navigate, nugget_id);
    } else if (type === 2) {
      accountVerifyHandle(res, "sms", navigate, nugget_id);
    }
  };

  /**
   * Handles the login service by sending a request to the server with the provided values.
   * @param {object} values - The login values object.
   * @returns None
   */
  const HandleLoginService = (values) => {
    let loginData = {
      ...values,
      auth_code: getAuthToken(values.username),
    };
    loginService(JSONtoformdata(loginData))
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.acc_verify_status === 0) {
            toast.remove("rawcaster");
            toast.success(res.data.msg, { id: "rawcaster" });
            handleProfileUpdate(res.data, res.data.signup_type);
            return;
          }
          dispatch(fetchuserInfobyToken(res.data.token)).then(({ payload }) => {
            let finalVal = {
              ...res.data,
            };
            delete finalVal["name"];
            setCookieData("rawcaster_user_token", finalVal);
            if (nugget_id) {
              window.location.assign(`/view/${nugget_id}`);
            } else {
              if (res.data.first_time === 1) {
                window.location.assign("/selectinfluencers");
              } else if (getSessionStorageData("influencerData")) {
                window.location.assign("/selectinfluencers");
                removeSessionStorageData("influencerData");
              } else {
                navigate("/dashboard");
              }
            }
          });
        } else if (res.data.status === 2) {
          setredirectModal({ show: true, msg: res.data.msg });
        } else if (res.data.status === 0) {
          setFieldError("username", res.data.msg);
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  const carouselOptions = {
    items: 1,
    nav: false,
    loop: true,
  };
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Seo
        title={"Login"}
        description="Log in now to access the latest insights, experience for your social media performance."
      />
      <div className={classes.loginbg}>
        <div className={classes.mobHeader}>
          <Link to="/">
            <img src={mainlogowhite} alt="Back to Home" />
          </Link>
        </div>
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link to="/">
              <img
                className={classes.hideMob}
                src={mainlogo}
                alt="Back to Home"
              />
            </Link>
            <h1 className={classes.heading_h1}>Welcome to Rawcaster</h1>
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
            <SigninwithService type="Signin" />

            <div className={classes.copyright}>
              <img
                onClick={() => {
                  navigate("/");
                }}
                src={RawcasterLogo}
                alt="Rawcaster Logo"
              />
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
              <img src={SigninImg} alt="Connect Share Express" />
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <img src={SigninImg} alt="Connect Share Express" />
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <img src={SigninImg} alt="Connect Share Express" />
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
    </GoogleOAuthProvider>
  );
};

export default Login;
