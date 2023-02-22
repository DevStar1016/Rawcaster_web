import { Dropdown, Layout, Menu } from "antd";
import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
import classes from "./Layout.module.css";
import ProfileImg from "../UIComponents/ProfileImg";
import LiveIcon from "../Assets/Icons/svg/Live_Img.svg";
import HomeIcon from "../Assets/Icons/svg/Home_icon.svg";
import RawcasterLogo from "../Assets/Images/svg/rawcaster_logo.svg";
import SettingsIcon from "../Assets/Icons/svg/Settings_icon.svg";
import NotificationIcon from "../Assets/Icons/svg/Notification_Icon.svg";
import { useDispatch } from "react-redux";
import { logoutService } from "../Services/ApiService";
import { JSONtoformdata, RemoveToken } from "../Shared/Utility";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthData } from "../Shared/Reduxfetcher";
import ValidateTypeModal from "../Modal/ValidateTypeModal";

const HomeLayout = () => {
  const loginUserData = useAuthData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Content } = Layout;
  const onClick = ({ key }) => {
    if (key == 2) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    let logutData = {
      token: loginUserData?.token,
    };
    logoutService(JSONtoformdata(logutData))
      .then((res) => {
        if (res.data.status === 1) {
          RemoveToken(dispatch);
          navigate("/");
          toast.success("Logged out Successfully !!");
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <>
      <Layout>
        <div className={`${classes.topheader}`}>
          <div className={classes.fullcontainer}>
            <Menu mode="horizontal">
              <Link className={classes.logopart} to="/dashboard">
                <img src={RawcasterLogo} />
              </Link>
              <div className={` ${classes.topSearch}`}>
                <InputGroup>
                  <InputGroup.Text>
                    <span class="material-symbols-outlined">search</span>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search Rawcaster"
                    aria-label="Search Rawcaster"
                  />
                </InputGroup>
              </div>
              <div className={classes.rightMenus}>
                {loginUserData && (
                  <>
                    <img src={LiveIcon} className={classes.liveIcon} />
                    <img src={HomeIcon} className={classes.menuIcon} />
                    <img src={SettingsIcon} className={classes.menuIcon} />
                    <img src={NotificationIcon} className={classes.menuIcon} />
                  </>
                )}
                {/* <Dropdown menu={{ items }} placement="topRight" arrow>
              <Button>topRight</Button>
            </Dropdown> */}
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: "My Profile",
                      },
                      {
                        key: 2,
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
                      {loginUserData ? loginUserData?.name : "Log in/Sign up"}
                    </div>
                  </div>
                </Dropdown>
                {/* <Dropdown className={classes.DropMenu}>
                  <Dropdown.Toggle className={classes.dropMenuSec}>
               
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      Another action
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-3">
                      Something else
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}
              </div>
            </Menu>
          </div>
        </div>
        <Content className="site-layout mainsec">
          <Outlet />
        </Content>
        <ValidateTypeModal
          open={false}
          handleClose={() => {
            console.log("test");
          }}
        />
      </Layout>
    </>
  );
};

export default HomeLayout;
