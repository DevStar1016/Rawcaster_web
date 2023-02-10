import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import DateInputBox from "../../Sharedcomponents/DateInputBox";
import classes from "./Signup.module.css";
import SignupImg from "../../Assets/Images/png/signup-intro.png";
import { Col, Row } from "react-bootstrap";
import mainlogo from "../../Assets/Images/svg/rawcaster_logo.svg";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import GoogleIcon from "../../Assets/Icons/png/google_logo.png";
import FacebookIcon from "../../Assets/Icons/png/facebook_logo.png";
import TwitterIcon from "../../Assets/Icons/png/twitter_logo.png";
import AppleIcon from "../../Assets/Icons/png/apple_logo.png";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import { getGeocodeData } from "../../Shared/Utility";
import {
  LoginSocialApple,
  LoginSocialFacebook,
  LoginSocialGoogle,
  LoginSocialTwitter,
} from "reactjs-social-login";
import {
  APPLE_API_KEY,
  FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID,
  REDIRECT_URI,
  TWITTER_API_KEY,
} from "../../Shared/Constant";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getGeocodeData()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className={classes.loginbg}>
      <div className={classes.mobHeader}>
          <Link to="/home">
            <img src={mainlogowhite}  />
          </Link>
        </div>
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link>
              <img
                className={classes.hideMob}
                src={mainlogo}       
              />
            </Link>
            <h1 className={classes.heading_h1}>Join Rawcaster Family</h1>
            <p className={classes.subText}>
              Join now to access the latest insights, experience for your social
              media performance.
            </p>            
            <Form
              name="normal_login"
              className="login-form"
              autoComplete={"off"}
            >
              <Form.Item>
                <Button
                  block
                  htmlType="submit"
                  className={classes.signupbtn}
                  onClick={() => {
                    navigate("/signupwithemail");
                  }}
                >
                  Signup with a phone number or email
                </Button>
              </Form.Item>
              <div className={classes.dividerSec}>
                <p className={classes.divider}></p>
                <p>Or</p>
                <p className={classes.divider}></p>
              </div>
              <Row className="my-2 g-2">
                <Col sm={6}>
                  <LoginSocialGoogle
                    client_id={GOOGLE_CLIENT_ID}
                    redirect_uri={REDIRECT_URI}
                    scope="openid profile email"
                    discoveryDocs="claims_supported"
                    access_type="offline"
                    onResolve={({ provider, data }) => {
                      console.log(provider, data);
                    }}
                    onReject={(err) => {
                      console.log(err);
                    }}
                  >
                    <button className={classes.altSignBtn}>
                      <img src={GoogleIcon} /> Signup with Google
                    </button>
                  </LoginSocialGoogle>
                </Col>
                <Col sm={6}>
                  <LoginSocialFacebook
                    appId={FACEBOOK_APP_ID}
                    fieldsProfile={
                      "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
                    }
                    redirect_uri={REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      console.log(provider, data);
                    }}
                    onReject={(err) => {
                      console.log(err);
                    }}
                  >
                    <button className={classes.altSignBtn}>
                      <img src={FacebookIcon} /> Signup with Facebook
                    </button>
                  </LoginSocialFacebook>
                </Col>
                <Col sm={6}>
                  <LoginSocialTwitter
                    client_id={TWITTER_API_KEY}
                    redirect_uri={REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      console.log(provider, data);
                    }}
                    onReject={(err) => {
                      console.log(err);
                    }}
                  >
                    <button className={classes.altSignBtn}>
                      <img src={TwitterIcon} /> Signup with Twitter
                    </button>
                  </LoginSocialTwitter>
                </Col>
                <Col sm={6}>
                  <LoginSocialApple
                    client_id={APPLE_API_KEY}
                    scope={"name email"}
                    redirect_uri={REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      console.log(provider, data, "===>provider, data");
                    }}
                    onReject={(err) => {
                      console.log(err);
                    }}
                  >
                    <button className={classes.altSignBtn}>
                      <img src={AppleIcon} /> Signup with Apple
                    </button>
                  </LoginSocialApple>
                </Col>
              </Row>
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

        <div className={`${classes.sliderSec} ${classes.rightSec}`}>
          <div className={classes.contentBox}>
            <div className={classes.signupImgSec}>
              <img src={SignupImg} />
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

export default Signup;
