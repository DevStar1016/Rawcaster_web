import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import SignupImg from "../../Assets/Images/png/signup-intro.png";
import { Col, Row } from "react-bootstrap";
import mainlogo from "../../Assets/Images/svg/rawcaster_logo.svg";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import GoogleIcon from "../../Assets/Icons/png/google_logo.png";
import InstaIcon from "../../Assets/Icons/png/instagram_logo.png";
import TwitterIcon from "../../Assets/Icons/png/twitter_logo.png";
import AppleIcon from "../../Assets/Icons/png/apple_logo.png";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import {
  getAuthToken,
  getGeocodeData,
  JSONtoformdata,
} from "../../Shared/Utility";
import {
  LoginSocialApple,
  LoginSocialGoogle,
  LoginSocialInstagram,
  LoginSocialTwitter,
} from "reactjs-social-login";
import {
  APPLE_API_KEY,
  GOOGLE_CLIENT_ID,
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  INSTA_REDIRECT_URI,
  PRIMARY_REDIRECT_URI,
  REDIRECT_URI,
  SECONDARY_REDIRECT_URI,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
} from "../../Shared/Constant";
import jwt_decode from "jwt-decode";
import { toast } from "react-hot-toast";
import { SocialMediaLoginService } from "../../Services/ApiService";
import {
  getSessionStorageData,
  removeSessionStorageData,
  setCookieData,
  setLocalStorageData,
} from "../../Store/Storage";
import RedirectModal from "../../Modal/RedirectModal";
import { useDispatch } from "react-redux";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";
import SignupwithMobileImg from "../../Assets/Images/png/signupwithmobile-intro.png";
import SignupwithEmailImg from "../../Assets/Images/png/signupwithemail-intro.png";
import OwlCarousel from "react-owl-carousel";
import { getProfile } from "./getProfile";
import axios from "axios";
import Seo from "../../SEO/Seo";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [redirectModal, setredirectModal] = useState({ show: false, msg: "" });
  const [LocationValue, setLocationValue] = useState({
    geo_location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    getGeocodeData()
      .then((res) => {
        setLocationValue((pre) => ({
          ...pre,
          geo_location: res.address,
          latitude: res.location.lat,
          longitude: res.location.lng,
        }));
      })
      .catch((err) => {
        setLocationValue((pre) => ({
          ...pre,
          geo_location: "",
          latitude: "",
          longitude: "",
        }));
      });
  }, []);

  const HandleSignup = (values) => {
    let finalData = {
      ...values,
      ...LocationValue,
      auth_code: getAuthToken(values.email_id),
    };
    SocialMediaLoginService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          dispatch(handleLoginData(res.data));
          setCookieData("rawcaster_user_token", JSON.stringify(res.data.token));
          setLocalStorageData("rawcaster_user_token", JSON.stringify(res.data));
          const navigateHandle = () => {
            if (getSessionStorageData("influencerData")) {
              navigate("/selectinfluencers");
              removeSessionStorageData("influencerData");
            } else {
              navigate("/dashboard");
            }
          };
          getProfile(res.data.token, dispatch, navigateHandle);
        } else if (res.data.status === 2) {
          setredirectModal({ show: true, msg: res.data.msg });
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
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

  const handleInstaLogin = () => {
    axios
      .get(
        `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=https://localhost:3000/signup/&scope=user_profile,user_media&response_type=code`
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Seo title={"Signup"} />
      <div className={classes.loginbg}>
        <div className={classes.mobHeader}>
          <Link to="/home">
            <img src={mainlogowhite} />
          </Link>
        </div>
        <div className={classes.loginSec}>
          <div className={classes.loginBox}>
            <Link to="/">
              <img className={classes.hideMob} src={mainlogo} />
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
                    redirect_uri={PRIMARY_REDIRECT_URI}
                    scope="openid profile email"
                    discoveryDocs="claims_supported"
                    access_type="offline"
                    onResolve={({ provider, data }) => {
                      let resultVal = {
                        signin_type: 5,
                        first_name: data.name,
                        display_name: data.name,
                        email_id: data.email,
                      };
                      HandleSignup(resultVal);
                    }}
                    onReject={(err) => {
                      toast.error("Something Went Wrong !!");
                    }}
                  >
                    <button
                      className={classes.altSignBtn}
                      onClick={() => {
                        // Makes sure the page reloads. Changes are only visible after you refresh.
                      }}
                    >
                      <img src={GoogleIcon} /> Signup with Google
                    </button>
                  </LoginSocialGoogle>
                </Col>
                <Col sm={6}>
                  {/* <LoginSocialFacebook
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
                  ></LoginSocialFacebook> */}

                  <LoginSocialInstagram
                    client_id={INSTAGRAM_APP_ID}
                    client_secret={INSTAGRAM_APP_SECRET}
                    scope="user_profile"
                    redirect_uri={INSTA_REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      console.log(provider, data);
                    }}
                    onReject={(err) => {
                      toast.error("Something Went Wrong !!");
                    }}
                  >
                    <button
                      className={classes.altSignBtn}
                      onClick={() => {
                        handleInstaLogin();
                      }}
                    >
                      <img src={InstaIcon} /> Signup with Instagram
                    </button>
                  </LoginSocialInstagram>
                </Col>
                <Col sm={6}>
                  <LoginSocialTwitter
                    client_id={TWITTER_CLIENT_ID}
                    client_secret={TWITTER_CLIENT_SECRET}
                    redirect_uri={REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      console.log(provider, data);
                    }}
                    onReject={(err) => {
                      toast.error("Something Went Wrong !!");
                    }}
                  >
                    <button className={classes.altSignBtn}>
                      <img src={TwitterIcon} /> Signup with Twitter
                    </button>
                  </LoginSocialTwitter>
                </Col>
                <Col sm={6}>
                  {/* <AppleLogin
                    clientId={APPLE_API_KEY}
                    redirectURI={PRIMARY_REDIRECT_URI}
                    scope={"name email"}
                    responseMode="form_post"
                    render={({ onClick }) => {
                      return (
                        <button
                          className={classes.altSignBtn}
                          onClick={onClick}
                        >
                          <img src={AppleIcon} /> Signup with Apple
                        </button>
                      );
                    }}
                    callback={(value) => {
                      console.log(value, "==>value");
                    }}
                  /> */}
                  <LoginSocialApple
                    client_id={APPLE_API_KEY}
                    scope={"name email"}
                    redirect_uri={SECONDARY_REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      var decoded = jwt_decode(data.authorization.id_token);
                      if (decoded?.email && decoded?.email !== "") {
                        let resultVal = {
                          signin_type: 2,
                          first_name:
                            data?.user?.name?.firstName || decoded.email,
                          display_name:
                            data?.user?.name?.firstName || decoded.email,
                          email_id: decoded.email,
                        };
                        HandleSignup(resultVal);
                      } else {
                        toast.error("Something Went Wrong !!");
                      }
                    }}
                    onReject={(err) => {
                      toast.error("Something Went Wrong !!");
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

        <div
          className={`${classes.sliderSec} ${classes.rightSec} signup_carosel`}
        >
          <OwlCarousel className={"owl-theme "} {...carouselOptions}>
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
            <div className={classes.contentBox}>
              <div className={classes.signupImgSec}>
                <img src={SignupwithMobileImg} />
              </div>
              <h2>Live Talk Shows</h2>
              <h4>
                with Rawcaster Influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
            <div className={classes.contentBox}>
              <div className={classes.signupImgSec}>
                <img src={SignupwithEmailImg} />
              </div>
              <h2>Schedule Events</h2>
              <h4>
                with Rawcaster Influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
          </OwlCarousel>
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
        </div>
      </div>
    </>
  );
};

export default Signup;
