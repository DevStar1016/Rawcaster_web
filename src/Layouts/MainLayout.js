import { Layout, Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router";
import classes from "./Layout.module.css";
import mainlogo from "../Assets/Images/svg/rawcaster_logo.svg";
import { Button } from "antd";
import { Link } from "react-router-dom";

const MainLayout = () => {
  const { Header, Content } = Layout;
  const navigate = useNavigate();
  return (
    <Layout>
      <Menu className={`${classes.topbar}`} mode="horizontal">
        <Menu.Item key="join">
          <a to="/joinmeeting">Join a meeting</a>
        </Menu.Item>
        <Menu.Item key="Host">
          <a to="/signin">Host a meeting</a>
        </Menu.Item>
        <Menu.Item key="download">
          <a to="/appdownloadscreen">Download</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a to="/support">Support</a>
        </Menu.Item>
        <Menu.Item key="mail">
          <a to="/faq">FAQs</a>
        </Menu.Item>
      </Menu>
      {/* <Header className={classes.header}> <Navbar /> </Header> */}
      <Content className="site-layout mainsec">
        <div className={classes.homeheader}>
          <img className={classes.mainlogo} src={mainlogo} />
          <div className={classes.rightmenu}>
            <Link>Tutorials</Link>
            <Link to="/login">Sign in</Link>
            <Button
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </Button>
          </div>
        </div>
        <Outlet />

        {/* <LoginSlider /> */}
      </Content>
    </Layout>
  );
};

export default MainLayout;
