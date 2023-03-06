import { Button } from "antd";
import React, { useEffect, useState } from "react";
import classes from "./SuggestedInfluencers.module.css";
import GoogleIcon from "../Assets/Icons/png/google_logo.png";
import AppleIcon from "../Assets/Icons/png/apple_logo.png";
import { LoginSocialApple, LoginSocialGoogle } from "reactjs-social-login";
import {
  APPLE_API_KEY,
  GOOGLE_CLIENT_ID,
  PRIMARY_REDIRECT_URI,
  SECONDARY_REDIRECT_URI,
} from "../Shared/Constant";
import { SocialMediaLoginService } from "../Services/ApiService";
import {
  getAuthToken,
  getGeocodeData,
  JSONtoformdata,
} from "../Shared/Utility";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleLoginData } from "../Store/Redux/Reducer/AuthReducer";
import { setCookieData, setLocalStorageData } from "../Store/Storage";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import RedirectModal from "../Modal/RedirectModal";
import {
  handleLoading,
  handlenuggetVideoPaused,
} from "../Store/Redux/Reducer/DashboardReducer";
import SuggestedInfluencers from "./SuggestedInfluencers";
import { useAuthData } from "../Shared/Reduxfetcher";
import VideoPlayer from "../UIComponents/VideoPlayer";

const DashboardSignup = () => {
  const loginUserData = useAuthData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          navigate("/dashboard");
        } else if (res.data.status === 2) {
          setredirectModal({ show: true, msg: res.data.msg });
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  return (
    <>
      <div className={classes.beforeloginSec}>
        {loginUserData === null ? (
          <div className={classes.inpad}>
            <div className={classes.advideoSec}>
              <video
                width="100%"
                height="100%"
                style={{ zIndex: 500 }}
                controls
                disablePictureInPicture
                playsInline
                preload="metadata"
                controlsList="nodownload"
                src="https://rawcaster.com/rawadmin/uploads/default/myluckyzone.mp4#t=0.001"
                type="video/mp4"
                onPlayCapture={() => {
                  console.log("test");
                }}
              />

              <h1>New to Rawcaster?</h1>
              <p>
                Sign up now to get your own space and post a Nuggets, talk
                shows, Events and more.
              </p>
            </div>
            <LoginSocialGoogle
              client_id={GOOGLE_CLIENT_ID}
              redirect_uri={PRIMARY_REDIRECT_URI}
              scope="openid profile email"
              discoveryDocs="claims_supported"
              access_type="offline"
              onResolve={({ provider, data }) => {
                dispatch(handleLoading(true));
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
              <Button className={classes.altSignBtn}>
                <img src={GoogleIcon} alt="Signup_with_Google" /> Signup with
                Google
              </Button>
            </LoginSocialGoogle>
            <LoginSocialApple
              client_id={APPLE_API_KEY}
              scope={"name email"}
              redirect_uri={SECONDARY_REDIRECT_URI}
              onResolve={({ provider, data }) => {
                dispatch(handleLoading(true));
                var decoded = jwt_decode(data.authorization.id_token);
                if (decoded?.email && decoded?.email !== "") {
                  let resultVal = {
                    signin_type: 2,
                    first_name: data?.user?.name?.firstName || decoded.email,
                    display_name: data?.user?.name?.firstName || decoded.email,
                    email_id: decoded.email,
                  };
                  HandleSignup(resultVal);
                } else {
                  toast.error("Something Went Wrong !!");
                }
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <Button className={classes.altSignBtn}>
                <img src={AppleIcon} alt="Signup_with_Apple" /> Signup with
                Apple
              </Button>
            </LoginSocialApple>
            <Button
              className={classes.signupbtn}
              onClick={() => {
                navigate("/signupwithemail");
              }}
            >
              Signup with a phone number or email
            </Button>
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
            <SuggestedInfluencers />
          </div>
        ) : (
          <div className={classes.inpad}>
            <div className={classes.advideoSec}>
              {/* <VideoPlayer
                url={
                  "https://rawcaster.com/rawadmin/uploads/default/myluckyzone.mp4"
                }
              /> */}
              <video
                id="dashboard_signup_video"
                style={{ zIndex: 500 }}
                controls
                disablePictureInPicture
                playsInline
                controlsList="nodownload"
                onPlayCapture={() => {
                  dispatch(handlenuggetVideoPaused(true));
                }}
              >
                <source src="https://rawcaster.com/rawadmin/uploads/default/myluckyzone.mp4" />
              </video>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardSignup;
