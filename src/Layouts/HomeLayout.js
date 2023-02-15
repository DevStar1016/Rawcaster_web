import { Layout, Menu } from "antd";
import React from "react";
import { Dropdown, Form, InputGroup } from "react-bootstrap";
import { Outlet } from "react-router";
import classes from "./Layout.module.css";
import UserImg from "../Assets/Images/svg/userImg.svg";
import ProfileImg from "../UIComponents/ProfileImg";
import LiveIcon from "../Assets/Icons/svg/Live_Img.svg";
import HomeIcon from "../Assets/Icons/svg/Home_icon.svg";
import SettingsIcon from "../Assets/Icons/svg/Settings_icon.svg";
import NotificationIcon from "../Assets/Icons/svg/Notification_Icon.svg";

const HomeLayout = () => {
  const { Content } = Layout;
  return (
    <>
      <Layout>
        <div className={`${classes.topheader}`}>
          <div className="mainWrapper">
            <Menu mode="horizontal">
              <div className="logoImage" />
              <InputGroup className={` ${classes.homeSearchInput}`}>
                <InputGroup.Text>
                  <span class="material-symbols-outlined">search</span>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search Rawcaster"
                  aria-label="Search Rawcaster"
                />
              </InputGroup>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <img src={LiveIcon} className={classes.liveIcon} />
                <img src={HomeIcon} className={classes.menuIcon} />
                <img src={SettingsIcon} className={classes.menuIcon} />
                <img src={NotificationIcon} className={classes.menuIcon} />
                {/* <Dropdown menu={{ items }} placement="topRight" arrow>
              <Button>topRight</Button>
            </Dropdown> */}
                <Dropdown className={classes.DropMenu}>
                  <Dropdown.Toggle className={classes.dropMenuSec}>
                    <ProfileImg src={UserImg} Badgetype={1} /> Danii
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
                </Dropdown>
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
