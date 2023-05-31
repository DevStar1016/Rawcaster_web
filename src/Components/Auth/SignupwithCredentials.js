import { Button, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import classes from "./Signup.module.css";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import SignupwithMobileImg from "../../Assets/Images/png/signupwithmobile-intro.png";
import SignupwithEmailImg from "../../Assets/Images/png/signupwithemail-intro.png";
import SignupImg from "../../Assets/Images/png/signup-intro.png";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  EMAIL_REGEX,
  GENDER_TYPE,
  MOBILE_NUMBER_REGEX,
} from "../../Shared/Constant";
import {
  getAuthToken,
  getGeocodeData,
  JSONtoformdata,
} from "../../Shared/Utility";
import { signupService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import RedirectModal from "../../Modal/Verification/RedirectModal";
import moment from "moment";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { accountVerifyHandle } from "./Utility";

const SignupwithCredentials = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [redirectModal, setredirectModal] = useState({ show: false, msg: "" });
  const navigate = useNavigate();
  const getLoginType = () => {
    if (pathname.includes("signupwithemail")) {
      return {
        id: 1,
        title: "Email Address",
        instead: "Phone Number",
        pathname: "/signupwithmobile",
        image: SignupwithMobileImg,
      };
    } else {
      return {
        id: 2,
        title: "Phone Number",
        instead: "Email",
        pathname: "/signupwithemail",
        image: SignupwithEmailImg,
      };
    }
  };

  const validationSchema = yup.object().shape({
    first_name: yup
      .string()
      .max(50, "Name cannot be longer than 50 characters")
      .required("Please input your Name!"),
    gender: yup.string().required(`Please input your Gender!`),
    email_id: yup
      .string()
      .min(5, `Please Enter Valid ${getLoginType().title}`)
      .matches(
        getLoginType().id === 1 ? EMAIL_REGEX : MOBILE_NUMBER_REGEX,
        `Please Enter Valid ${getLoginType().title}!`
      )
      .required(`Please input your ${getLoginType().title}!`),
    password: yup
      .string()
      // .matches(
      //   PASSWORD_EXP,
      //   "Your password to be at least 8 characters long, contain uppercase letter (A-Z), lowercase letter (a-z), symbol (!@#$%) and a number (0-9)."
      // )
      .trim("The Password cannot include leading and trailing spaces")
      .strict(true)
      .min(8, "Password must be at least 8 characters long")
      .required("Please input your Password!"),
    dob: yup.string().required("Please input your Date of Birth!"),
  });

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    setValues,
  } = useFormik({
    initialValues: {
      first_name: "",
      email_id: "",
      gender: "",
      password: "",
      dob: "",
      geo_location: "",
      latitude: "",
      longitude: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(handleLoading(true));
      HandleSignup(values);
    },
  });

  useEffect(() => {
    getGeocodeData()
      .then((res) => {
        setValues((pre) => ({
          ...pre,
          geo_location: res.address,
          latitude: res.location.lat,
          longitude: res.location.lng,
        }));
      })
      .catch((err) => {
        setValues((pre) => ({
          ...pre,
          geo_location: "",
          latitude: "",
          longitude: "",
        }));
      });
  }, []);

  const HandleSignup = (values) => {
    let signupValue = {
      ...values,
      display_name: values.first_name,
      confirm_password: values.password,
      auth_code: getAuthToken(values.email_id),
      signup_type: getLoginType().id,
    };
    signupService(JSONtoformdata(signupValue))
      .then((res) => {
        if (res.data.status === 1) {
          handleProfileUpdate(res.data);
        } else if (res.data.status === 2) {
          setredirectModal({ show: true, msg: res.data.msg });
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  const handleProfileUpdate = (res) => {
    if (getLoginType().id === 1) {
      accountVerifyHandle(res, "email", navigate);
    } else if (getLoginType().id === 2) {
      accountVerifyHandle(res, "sms", navigate);
    }
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
          <Link to="/home">
            <img src={mainlogowhite} alt="Back to Home" />
          </Link>
        </div>
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link to="/">
              <img
                className={classes.hideMob}
                src={require("../../Assets/Images/png/rawcater_logo.png")}
                alt="Back to Home"
              />
            </Link>
            <h1 className={classes.heading_h1}>Join Rawcaster Family</h1>
            <p className={classes.subText}>
              Join now to access the latest insights, experience for your social
              media performance.
            </p>
            <Form
              first_name="rawcaster_signup"
              autoComplete="off"
              onSubmitCapture={handleSubmit}
            >
              <p className={classes.label}>Name</p>
              <Form.Item name="first_name">
                <Input
                  className={classes.textBox}
                  placeholder="Enter your name"
                  autoComplete="off"
                  value={values.first_name}
                  onChange={handleChange("first_name")}
                  maxLength={50}
                  status={
                    touched.first_name && errors.first_name ? "error" : ""
                  }
                />
                {touched.first_name && (
                  <p className="ErrTxt">{errors?.first_name}</p>
                )}
              </Form.Item>
              <p className={classes.label}>{getLoginType().title}</p>
              <Form.Item name="email_id">
                <Input
                  className={classes.textBox}
                  placeholder={`Enter your ${getLoginType().title}`}
                  autoComplete="off"
                  value={values.email_id}
                  onChange={handleChange("email_id")}
                  maxLength={50}
                  status={touched.email_id && errors.email_id ? "error" : ""}
                />
                <div className="d-flex flex-row justify-content-between">
                  <p className="ErrTxt">
                    {touched.email_id ? errors?.email_id : ""}
                  </p>
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
                  status={touched.password && errors.password ? "error" : ""}
                  onChange={handleChange("password")}
                />
                {touched.password && (
                  <p className="ErrTxt">{errors?.password}</p>
                )}
              </Form.Item>
              <p className={classes.label}>Gender</p>
              <Form.Item name="gender" className="genderSelect">
                <Select
                  className={classes.selectBox}
                  placeholder="Select Gender"
                  status={touched.gender && errors.gender ? "error" : ""}
                  value={values.gender}
                  onSelect={(val) => {
                    setFieldValue("gender", val);
                  }}
                >
                  {GENDER_TYPE.map(({ key, label }) => (
                    <Select.Option value={key}>{label}</Select.Option>
                  ))}
                </Select>
                {touched.gender && <p className="ErrTxt">{errors?.gender}</p>}
              </Form.Item>
              <p className={classes.label}>Date of Birth</p>
              <Form.Item>
                <DateInputBox
                  value={values.dob}
                  status={errors.dob ? "error" : ""}
                  onSelectDate={(date) => {
                    if (date !== "") {
                      setFieldValue("dob", moment(date).format("YYYY-MM-DD"));
                    } else {
                      setFieldValue("dob", "");
                    }
                  }}
                />
                {touched.dob && <p className="ErrTxt">{errors?.dob}</p>}
              </Form.Item>
              <p className={classes.termText}>
                By Signing up you agree with Rawcaster's{" "}
                <Link to="/termsandconditions">terms and conditions</Link>
              </p>
              <br />

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
              <img src={RawcasterLogo} alt="Rawcaster" />
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
          className={`${classes.sliderSec} ${classes.rightSec} signup_carosel`}
        >
          <OwlCarousel className={"owl-theme "} {...carouselOptions}>
            <div className={classes.contentBox}>
              <div className={classes.signupImgSec}>
                <img src={SignupImg} alt="Connect Share Express" />
              </div>
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster Influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <div className={classes.signupImgSec}>
                <img src={SignupwithMobileImg} alt="Live Talk Shows" />
              </div>
              <h2>Live Talk Shows</h2>
              <h4>
                with Rawcaster Influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <div className={classes.signupImgSec}>
                <img src={SignupwithEmailImg} alt="Schedule Events" />
              </div>
              <h2>Schedule Events</h2>
              <h4>
                with Rawcaster Influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
          </OwlCarousel>
        </div>
      </div>
      <RedirectModal
        open={redirectModal.show}
        msg={redirectModal.msg}
        Btnname={"Sign in"}
        onSuccess={() => {
          navigate("/login");
          setredirectModal({ show: false, msg: "" });
        }}
        onClose={() => {
          setredirectModal({ show: false, msg: "" });
        }}
      />
    </>
  );
};

export default SignupwithCredentials;
