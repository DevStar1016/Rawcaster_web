/**
 * A component that renders the signup page for the dashboard.
 * @returns JSX element
 */
import { Button, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import classes from "./SuggestedInfluencers.module.css";
import GoogleIcon from "../Assets/Icons/png/google_logo.png";
import AppleIcon from "../Assets/Icons/png/apple_logo.png";
import { LoginSocialApple, LoginSocialGoogle } from "reactjs-social-login";
import {
  APPLE_API_KEY,
  DEFAULT_VIDEO,
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
import {
  getSessionStorageData,
  removeSessionStorageData,
  setCookieData,
} from "../Store/Storage";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import { handleLoading } from "../Store/Redux/Reducer/DashboardReducer";
import SuggestedInfluencers from "./SuggestedInfluencers";
import { useAuth, useAuthData } from "../Shared/Reduxfetcher";
import RedirectModal from "../Modal/Verification/RedirectModal";
import Connections from "../Components/Connections/Friends/Connections";
import Groups from "../Components/Connections/Groups/Groups";
import VideoThumb from "../Assets/Images/Video_preview.jpg";
import { handlenuggetVideoPaused } from "../Store/Redux/Reducer/NuggetsReducer";
import { fetchuserInfobyToken } from "../Store/Redux/Action";
import { useMainContext } from "../Shared/Context";
import StickyPopup from "../Modal/StickyPopup/Stickypopup";
import Header from "../Components/ChatBox/Header";
import Content from "../Components/ChatBox/Group/Content";

const DashboardSignup = () => {
  const { player, setplayer, setisChatOpen, isChatOpen } = useMainContext();
  const loginUserData = useAuthData();
  const { isSuccess } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [redirectModal, setredirectModal] = useState({ show: false, msg: "" });
  const [Controlls, setControlls] = useState(false);
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
          dispatch(fetchuserInfobyToken(res.data.token)).then(({ payload }) => {
            let finalVal = {
              ...res.data,
            };
            delete finalVal["name"];
            setCookieData("rawcaster_user_token", finalVal);
            if (getSessionStorageData("influencerData")) {
              navigate("/selectinfluencers");
              removeSessionStorageData("influencerData");
            } else {
              navigate("/dashboard");
            }
          });
        } else if (res.data.status === 2) {
          setredirectModal({ show: true, msg: res.data.msg });
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  return (
    <>
      <div className={classes.beforeloginSec}>
        {loginUserData === null && isSuccess ? (
          <div className={classes.inpad}>
            <div
              style={{
                height: "inherit",
                maxHeight: "inherit",
              }}
              className={classes.advideoSec}
            >
              <video
                width="100%"
                height="100%"
                id="dashboardSignup"
                style={{ zIndex: 500 }}
                controls={Controlls}
                disablePictureInPicture
                playsInline
                preload="metadata"
                controlsList="nodownload"
                src={DEFAULT_VIDEO}
                poster={VideoThumb}
                onPlayingCapture={() => {
                  if (player && player.id !== `dashboardSignup`) {
                    player.pause();
                  }
                  const video = document.getElementById(`dashboardSignup`);
                  setplayer(video);
                }}
                type="video/mp4"
                onPlayCapture={() => {
                  setControlls(true);
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
              onResolve={({ _, data }) => {
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
                toast.remove("rawcaster");
                toast.error("Something Went Wrong !!", { id: "rawcaster" });
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
                  toast.remove("rawcaster");
                  toast.error("Something Went Wrong !!", { id: "rawcaster" });
                }
              }}
              onReject={(err) => {}}
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
                // controls={Controlls}
                disablePictureInPicture
                playsInline
                controlsList="nodownload"
                poster={VideoThumb}
                onPlayingCapture={() => {
                  if (player && player.id !== `dashboard_signup_video`) {
                    player.pause();
                  }
                  const video = document.getElementById(
                    `dashboard_signup_video`
                  );
                  setplayer(video);
                }}
                onPlayCapture={() => {
                  dispatch(handlenuggetVideoPaused(true));
                  setControlls(true);
                }}
              >
                <source src="https://rawcaster.com/rawadmin/uploads/default/myluckyzone.mp4" />
              </video>
            </div>
            <Groups />
            <Connections />
          </div>
        )}
        {isChatOpen.show && (
          // <LinkDeviceModal
          //   open={isChatOpen}
          //   close={() => {
          //     setisChatOpen(false);
          //   }}
          // />
          <StickyPopup
            open={isChatOpen.show}
            HeaderContainer={Header}
            Content={Content}
            close={() => {
              setisChatOpen({
                show: false,
                type: "",
                id: "",
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default DashboardSignup;
