import { Dropdown, Layout, Popover, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import classes from "./Layout.module.css";
import ProfileImg from "../UIComponents/ProfileImg";
import LiveIcon from "../Assets/Icons/Live_Img.gif";
import ReferalIcon from "../Assets/Icons/svg/Referal.svg";
import RawcasterLogo from "../Assets/Images/svg/rawcaster_logo.svg";
import smLogo from "../Assets/Images/png/r_logo.png";
import SettingsIcon from "../Assets/Icons/svg/Settings_icon.svg";
import btmevent from "../Assets/Images/svg/btmevent.svg";
import btmbell from "../Assets/Images/svg/btmbell.svg";
import btmtv from "../Assets/Images/svg/btmtv.svg";
import btmuser from "../Assets/Images/svg/btmuser.svg";
import btmhome from "../Assets/Images/svg/btmhome.svg";
import NotificationIcon from "../Assets/Icons/svg/Notification_Icon.svg";
import { useDispatch } from "react-redux";
import { logoutService } from "../Services/ApiService";
import {
  filterValidObject,
  getAuthenticated,
  handleProfileNavigate,
  isAccountValid,
  JSONtoformdata,
  RemoveToken,
} from "../Shared/Utility";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth, useAuthData, useNuggets } from "../Shared/Reduxfetcher";
import {
  handledasboardTab,
  handleisGlobalSearch,
  handleLoading,
  handleloginModalShow,
  handleprofileVerifyModalShow,
} from "../Store/Redux/Reducer/DashboardReducer";
import { removeSessionStorageData } from "../Store/Storage";
import { fetchNuggetsbyId } from "../Store/Redux/Action";
import {
  handleNuggetFormData,
  handleResetNuggets,
} from "../Store/Redux/Reducer/NuggetsReducer";
import Notification from "../Components/Notifications";

const HomeLayout = () => {
  const params = useParams();
  const inputRef = useRef();
  const { pathname } = useLocation();
  const { isSuccess } = useAuth();
  const { nuggetFormData } = useNuggets();
  const [isshowSearchBox, setisshowSearchBox] = useState(false);
  const [searchData, setsearchData] = useState("");
  const loginUserData = useAuthData();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Content } = Layout;
  const onClick = ({ key }) => {
    if (parseInt(key) === 3) {
      dispatch(handleResetNuggets());
      handleLogout();
    }
    if (parseInt(key) === 2) {
      navigate("/setting");
    }
    if (parseInt(key) === 1) {
      let finalData = {
        dispatch,
        navigate,
        nuggetFormData,
        user_id: loginUserData?.user_id,
      };
      handleProfileNavigate(finalData);
    }
  };

  const handleLogout = () => {
    dispatch(handleLoading(true));
    let logutData = {
      token: loginUserData?.token,
    };
    logoutService(JSONtoformdata(logutData))
      .then((res) => {
        if (res.data.status === 1) {
          RemoveToken(dispatch);
          dispatch(handleLoading(false));
          window.location.assign("/");
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (params) {
      setsearchData(params.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pathname.includes("globalsearch")) {
      setsearchData("");
    }
  }, [pathname]);

  return (
    <>
      <Layout>
        <div className={`${classes.topheader}`}>
          <div className={classes.fullcontainer}>
            <div mode="horizontal" className="d-flex flex-row">
              <Link className={classes.logopart} to="/dashboard">
                <img
                  className="d-none d-sm-block"
                  src={RawcasterLogo}
                  alt="rawcaster_logo"
                />
                <img
                  className={`d-block d-sm-none ${classes.smLogo}`}
                  src={smLogo}
                  alt="rawcaster_sm_logo"
                />
              </Link>
              <div className={`d-none d-sm-block ${classes.topSearch}`}>
                <InputGroup>
                  <InputGroup.Text>
                    <span class="material-symbols-outlined">search</span>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search Rawcaster"
                    aria-label="Search Rawcaster"
                    ref={inputRef}
                    value={searchData}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (getAuthenticated()) {
                          if (isAccountValid(loginUserData)) {
                            if (e.nativeEvent.target.value.trim() !== "") {
                              dispatch(handleisGlobalSearch(true));
                              let filterData = { ...nuggetFormData };
                              filterData.formData = {
                                ...filterData.formData,
                                search_key: e.nativeEvent.target.value,
                                user_id: null,
                                page_number: 1,
                              };
                              filterData.formData = filterValidObject(
                                filterData.formData
                              );
                              dispatch(handleResetNuggets());
                              dispatch(
                                handleNuggetFormData(
                                  filterValidObject(filterData)
                                )
                              );
                              dispatch(
                                fetchNuggetsbyId(filterValidObject(filterData))
                              );
                              navigate(
                                `/globalsearch/${e.nativeEvent.target.value}`
                              );
                            }
                          } else {
                            dispatch(
                              handleprofileVerifyModalShow({
                                show: true,
                                msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                              })
                            );
                          }
                        } else {
                          dispatch(handleloginModalShow(true));
                        }
                      }
                    }}
                    onChange={(e) => {
                      setsearchData(e.target.value);
                    }}
                  />
                </InputGroup>
              </div>

              <div className={classes.rightMenus}>
                {loginUserData && (
                  <div>
                    <img
                      src={LiveIcon}
                      className={classes.liveIcon}
                      alt="live_icon"
                    />
                    <img
                      src={ReferalIcon}
                      className={classes.liveIcon}
                      alt="referal_icon"
                      onClick={() => {
                        navigate("/referel");
                      }}
                    />
                    <img
                      src={SettingsIcon}
                      className={`${classes.onlydes} ${classes.menuIcon}`}
                      alt="Settings_logo"
                      onClick={() => {
                        navigate("/dashboard");
                      }}
                    />
                    <div className={classes.onlydes} style={{float:"right"}}>
                      <Notification
                        src={NotificationIcon}
                        className={`${classes.onlydes} ${classes.menuIcon}`}
                      />
                    </div>
                  </div>
                )}
                <div
                  className={
                    loginUserData
                      ? classes.searchIconmob
                      : classes.beforeSearchicon
                  }
                >
                  <span
                    className={`material-icons ${classes.search_icon}`}
                    onClick={() => {
                      setisshowSearchBox(true);
                    }}
                  >
                    search
                  </span>
                </div>

                <div
                  className={classes.searchmobSec}
                  style={{ display: isshowSearchBox ? "block" : "none " }}
                >
                  <span className={`material-icons ${classes.search_icon}`}>
                    search
                  </span>
                  <input type="text" placeholder={"Search Rawcaster"}></input>
                  <span
                    className={`material-icons ${classes.clsIcon}`}
                    onClick={() => {
                      setisshowSearchBox(false);
                    }}
                  >
                    close
                  </span>
                </div>
                <Dropdown
                  placement="bottomRight"
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: "My Profile",
                      },
                      {
                        key: 2,
                        label: "Settings",
                      },
                      {
                        key: 3,
                        label: "Logout",
                      },
                    ],
                    onClick,

                    selectable: true,
                  }}
                  trigger={["click"]}
                  disabled={loginUserData === null}
                >
                  <div
                    className={classes.DropMenu}
                    onClick={() => {
                      if (loginUserData === null) {
                        navigate("/login");
                      }
                    }}
                  >
                    <div className={classes.dropMenuSec}>
                      <ProfileImg
                        isLoggedIn={loginUserData}
                        src={loginUserData?.profile_image}
                        imgClassName={classes.profileimg}
                        badgeClassName={classes.badgeImg}
                        Badgetype={loginUserData?.user_status_id}
                        BadgeTitle={loginUserData?.user_status}
                      />
                      <Tooltip title={loginUserData?.name} placement="right">
                        <span
                          className={classes.onlydes}
                          onClick={() => {
                            removeSessionStorageData("influencerData");
                          }}
                        >
                          {loginUserData && isSuccess
                            ? loginUserData?.name
                            : !isSuccess
                            ? "Hello User"
                            : "Log in/Sign up"}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.bottomMenu}>
          <img
            src={btmevent}
            alt="event_logo"
            onClick={() => {
              navigate("/dashboard");
              dispatch(handledasboardTab("event"));
            }}
          />

          <img
            src={btmbell}
            alt="notification_logo"
            onClick={() => {
              navigate("/dashboard");
              dispatch(handledasboardTab("notification"));
            }}
          />

          <img
            className={classes.btmhome}
            alt="home_logo"
            src={btmhome}
            onClick={() => {
              navigate("/dashboard");
              dispatch(handledasboardTab("nugget"));
            }}
          />
          <img src={btmtv} alt="talkshow_logo" />
          <img
            src={btmuser}
            alt="user_logo"
            onClick={() => {
              navigate("/dashboard");
              dispatch(handledasboardTab("usermenu"));
            }}
          />
        </div>
        <Content className="site-layout mainsec">
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};

export default HomeLayout;
