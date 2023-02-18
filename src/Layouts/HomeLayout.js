import { Dropdown, Layout, Menu } from "antd";
import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
import classes from "./Layout.module.css";
import UserImg from "../Assets/Images/svg/userImg.svg";
import ProfileImg from "../UIComponents/ProfileImg";
import LiveIcon from "../Assets/Icons/svg/Live_Img.svg";
import HomeIcon from "../Assets/Icons/svg/Home_icon.svg";
import RawcasterLogo from "../Assets/Images/svg/rawcaster_logo.svg";
import SettingsIcon from "../Assets/Icons/svg/Settings_icon.svg";
import NotificationIcon from "../Assets/Icons/svg/Notification_Icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutService } from "../Services/ApiService";
import { JSONtoformdata, RemoveToken } from "../Shared/Utility";
import { toast } from "react-hot-toast";

const HomeLayout = () => {
  const loginUserData = useSelector((state) => state.auth.loginUserData);
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
          navigate("/login");
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
           <div className={classes.logopart}> <img src={RawcasterLogo} /></div>
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
                <img src={LiveIcon} className={classes.liveIcon} />
                <img src={HomeIcon} className={classes.menuIcon} />
                <img src={SettingsIcon} className={classes.menuIcon} />
                <img src={NotificationIcon} className={classes.menuIcon} />
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
                >
                  <div className={classes.DropMenu}>
                    <div className={classes.dropMenuSec}>
                      <ProfileImg src={UserImg} Badgetype={1} /> {"User"}
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
      </Layout>
    </>
  );
};

export default HomeLayout;
