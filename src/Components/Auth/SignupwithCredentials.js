/**
 * A component for signing up with credentials.
 * @returns JSX element representing the signup form.
 */
import { Button, Checkbox, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  checkGeolocationPermission,
  getAuthToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { signupService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import moment from "moment";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { accountVerifyHandle } from "./Utility";
import { handleReferenceID } from "../../Store/Redux/Reducer/AuthReducer";
import { useAuth } from "../../Shared/Reduxfetcher";
import { HandleVerifyModal } from "../../Modal/DefaultModal";
import { VALIDATION_MESSAGES } from "../Settings/Constants";
import CountryCodeDropdown from "../../UIComponents/CountryCodeDropdown";

const SignupwithCredentials = () => {
  const { nugget_id } = useParams();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { reference_id } = useAuth();

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
      .test("validate Number", "Enter valid Number", function (value, ctx) {
        const { country_id } = this.parent;
        if (getLoginType().id === 2) {
          if (value && !country_id) {
            return ctx.createError({ message: "Country code is Required" });
          }
        }
        return true;
      })
      .required(`Please input your ${getLoginType().title}!`),
    password: yup
      .string()
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
      country_code: "",
      country_id: "",
      geo_location: "",
      latitude: "",
      longitude: "",
      other_gender: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (getLoginType().id === 2) {
        HandleVerifyModal({
          SubmitButtonTitle: "Continue",
          closeButtonTitle: "Register with email",
          primary: "success",
          onSuccess: () => {
            SignUpValidate();
          },
          onClose: () => {
            navigate(getLoginType().pathname);
          },
          message:
            VALIDATION_MESSAGES.MOBILE_NUMBER_VERIFIED_OPT_IN_ENABLE_BEFORE_SIGNUP,
        });
      } else {
        SignUpValidate();
      }
    },
  });

  useEffect(() => {
    // Your logic to clear the state when the route changes
    // For example, you can clear the data when the pathname changes
    if (pathname !== getLoginType().pathname) {
      setFieldValue("email_id", "");
    }
  }, [pathname]);

  const SignUpValidate = () => {
    checkGeolocationPermission()
      .then((res) => {
        if (res.status === 1) {
          dispatch(handleLoading(true));
          HandleSignup(values, res);
        } else {
          if (getLoginType().id === 2) {
            toast.error(res.message);
          } else {
            HandleSignup(values, null);
          }
        }
      })
      .catch((message) => {
        if (getLoginType().id === 2) {
          toast.error(message);
        } else {
          HandleSignup(values, null);
        }
      });
  };

  /**
   * Handles the signup process by sending the user's signup data to the server.
   * @param {object} values - The signup form values.
   * @returns None
   */
  const HandleSignup = (values, res = null) => {
    let signupValue = {
      ...values,

      display_name: values.first_name,
      confirm_password: values.password,
      auth_code: getAuthToken(values.email_id),
      signup_type: getLoginType().id,
      geo_location: res ? res.address : "",
      latitude: res ? res.location.lat : "",
      longitude: res ? res.location.lng : "",
    };
    if (reference_id) {
      signupValue = {
        ...signupValue,
        ref_id: reference_id,
      };
    }
    signupService(JSONtoformdata(signupValue))
      .then((res) => {
        if (res.data.status === 1) {
          handleProfileUpdate(res.data);
        } else if (res.data.status === 2) {
          HandleVerifyModal({
            primary: "success",
            message: res.data.msg,
            closeButtonTitle: "Cancel",
            SubmitButtonTitle: "Sign in",
            onSuccess: () => {
              window.location.assign("/login");
            },
            onClose: () => {},
          });
        } else if (res.data.status === 0) {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleReferenceID(null));
        dispatch(handleLoading(false));
      });
  };

  /**
   * Handles the profile update response based on the login type.
   * If the login type is email, it calls the accountVerifyHandle function with the "email" parameter.
   * If the login type is sms, it calls the accountVerifyHandle function with the "sms" parameter.
   * @param {any} res - The response object from the profile update request.
   * @returns None
   */
  const handleProfileUpdate = (res) => {
    if (getLoginType().id === 1) {
      accountVerifyHandle(res, "email", navigate, nugget_id);
    } else if (getLoginType().id === 2) {
      accountVerifyHandle(res, "sms", navigate, nugget_id);
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
                <div className="d-flex flex-row mobileInput">
                  {getLoginType().id === 2 && (
                    <CountryCodeDropdown
                      width="25%"
                      status={
                        touched.email_id && errors.email_id ? "error" : ""
                      }
                      value={values.country_code}
                      onSelectItem={(val) => {
                        setValues((pre) => ({
                          ...pre,
                          country_code: val.label,
                          country_id: val.key,
                        }));
                      }}
                    />
                  )}
                  <Input
                    className={classes.textBox}
                    placeholder={`Enter your ${getLoginType().title}`}
                    autoComplete="off"
                    value={values.email_id}
                    onChange={handleChange("email_id")}
                    maxLength={50}
                    style={{
                      marginLeft: getLoginType().id === 2 ? 10 : 0,
                    }}
                    status={touched.email_id && errors.email_id ? "error" : ""}
                  />
                </div>
                <p className="ErrTxt">
                  {touched.email_id ? errors?.email_id : ""}
                </p>
                <div className="d-flex flex-row justify-content-between align-item-center">
                  <div>
                    <Checkbox
                      checked={true}
                      style={{
                        display: getLoginType().id !== 2 ? "none" : "",
                      }}
                      className={classes.optinCheck}
                      onChange={() => {
                        HandleVerifyModal({
                          SubmitButtonTitle: "Close",
                          closeButtonTitle: "Register with email",
                          primary: "success",
                          onSuccess: () => {},
                          onClose: () => {
                            navigate(getLoginType().pathname);
                          },
                          message:
                            VALIDATION_MESSAGES.MOBILE_NUMBER_VERIFIED_OPT_IN_DISABLE_BEFORE_SIGNUP,
                        });
                      }}
                    >
                      Opt-in for SMS messages
                    </Checkbox>
                  </div>

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
              <p className={classes.label}>Sex</p>
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
              <p className={classes.label}>Gender</p>

              <Form.Item name="other_gender" className="pt-2">
                <Input
                  className={classes.textBox}
                  type="other_gender"
                  placeholder="Gender"
                  value={values.other_gender}
                  maxLength={50}
                  status={
                    touched.other_gender && errors.other_gender ? "error" : ""
                  }
                  onChange={handleChange("other_gender")}
                />
                {touched.other_gender && (
                  <p className="ErrTxt">{errors?.other_gender}</p>
                )}
              </Form.Item>
              <p className={classes.label}>Date of Birth</p>
              <Form.Item>
                <DateInputBox
                  value={values.dob}
                  isError={errors.dob && touched.dob}
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
              <img
                onClick={() => {
                  navigate("/");
                }}
                src={RawcasterLogo}
                alt="Rawcaster"
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
    </>
  );
};

export default SignupwithCredentials;
