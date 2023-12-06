/**
 * A React component for the Forgot Password page.
 * This component allows users to enter their login ID (username or email address)
 * and sends an OTP (One-Time Password) to their registered contact information.
 * If the OTP is successfully sent, the user is redirected to the Set Password page.
 * @returns JSX element representing the Forgot Password page.
 */
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import forgotImg from "../../Assets/Images/png/forgot-password.png";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { forgotPasswordService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { CHARACTER_LIMIT, MIN_CHARACTER_LIMIT } from "../../Shared/Constant";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(
      MIN_CHARACTER_LIMIT.LOGIN_ID,
      `Email or Phone Number Must be atleast ${MIN_CHARACTER_LIMIT.LOGIN_ID} Characters`
    )
    // .matches(LOGIN_ID, "Please Enter Valid Login ID")
    .required(`Please input your Login ID!`)
    .test("validate email", "Enter valid email", function (value) {
      if (/[A-Za-z]/.test(value)) {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }),
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

  /**
   * Handles the process of sending an OTP (One-Time Password) for password recovery.
   * @param {object} values - The values object containing the necessary data for sending the OTP.
   * @returns None
   */
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
              ...res.data,
              sms_type: res.data.sms_type,
              otp_ref_id: res.data.otp_ref_id,
              remaining_seconds: res.data.remaining_seconds,
            },
          });
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else if (res.data.status === 0) {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
        }
      })
      .catch((err) => {});
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
                alt="Forgot Password Rawcaster Logo"
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
                  maxLength={CHARACTER_LIMIT.LOGIN_ID}
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
              <img src={RawcasterLogo} alt="Copyright Rawcaster Logo" />
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
              alt="Back Button"
              src={require("../../Assets/Icons/png/Backbtn.png")}
            />
            <span>Go Back</span>
          </div>
        </div>

        <div className={`${classes.sliderSec} ${classes.nopad}`}>
          <div className={classes.rSec}>
            <div className={classes.contentBox}>
              <img src={forgotImg} alt="LockImage" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
