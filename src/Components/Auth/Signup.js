/**
 * A functional component that renders the signup page.
 * @returns The JSX elements representing the signup page.
 */
import { Button, Form } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./Signup.module.css";
import SignupImg from "../../Assets/Images/png/signup-intro.png";
import mainlogo from "../../Assets/Images/svg/rawcaster_logo.svg";
import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
import RawcasterLogo from "../../Assets/Images/png/r_logo.png";
import SignupwithMobileImg from "../../Assets/Images/png/signupwithmobile-intro.png";
import SignupwithEmailImg from "../../Assets/Images/png/signupwithemail-intro.png";
import OwlCarousel from "react-owl-carousel";
import Seo from "../SEO/Seo";
import SigninwithService from "./SigninwithService";
import React, { useEffect } from "react";
import { useMainContext } from "../../Shared/Context";
import { useDispatch } from "react-redux";
import { handleReferenceID } from "../../Store/Redux/Reducer/AuthReducer";

const Signup = () => {
  const dispatch = useDispatch();
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();
  const referanceId = query.get("ref");

  const { nugget_id } = useParams();
  const navigate = useNavigate();

  const carouselOptions = {
    items: 1,
    nav: false,
    loop: true,
  };

  useEffect(() => {
    if (referanceId) {
      dispatch(handleReferenceID(referanceId));
    }
  }, [referanceId]);

  return (
    <>
      <Seo title={"Signup"} />
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
                src={mainlogo}
                alt="Back to Home"
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
                    if (nugget_id) {
                      navigate(`/signupwithemail/${nugget_id}`);
                    } else {
                      navigate("/signupwithemail");
                    }
                  }}
                >
                  Signup with a phone number or email
                </Button>
              </Form.Item>

              <SigninwithService type="Signup" />

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

export default Signup;
