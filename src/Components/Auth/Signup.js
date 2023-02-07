import { Button, Form, Input } from "antd";
import React from "react";
import { Link, NavLink } from "react-router-dom";
// import DateInputBox from "../../Sharedcomponents/DateInputBox";
import classes from "./Signup.module.css";
import SignupImg from "../../Assets/Images/png/signup-intro.png";
import { Col, Row } from "react-bootstrap";
import GoogleIcon from "../../Assets/Icons/png/google_logo.png";
import FacebookIcon from "../../Assets/Icons/png/facebook_logo.png";
import TwitterIcon from "../../Assets/Icons/png/twitter_logo.png";
import AppleIcon from "../../Assets/Icons/png/apple_logo.png";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";

const Signup = () => {
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
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              autoComplete={"off"}
            >
              <Form.Item>
                <Button block htmlType="submit" className={classes.btn}>
                  Signup with a phone number or email
                </Button>
              </Form.Item>
              <div className={classes.dividerSec}>
                <p className={classes.divider}></p>
                <p>Or</p>
                <p className={classes.divider}></p>
              </div>
              <Row className="my-2">
                <Col sm={6}>
                  <button className={classes.altSignBtn}>
                    <img src={GoogleIcon} /> Signup with Google
                  </button>
                </Col>
                <Col sm={6}>
                  <button className={classes.altSignBtn}>
                    <img src={FacebookIcon} /> Signup with Facebook
                  </button>
                </Col>
                <Col sm={6}>
                  <button className={classes.altSignBtn}>
                    <img src={TwitterIcon} /> Signup with Twitter
                  </button>
                </Col>
                <Col sm={6}>
                  <button className={classes.altSignBtn}>
                    <img src={AppleIcon} /> Signup with Apple
                  </button>
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
