import { Layout, Menu } from "antd";
import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import classes from "./Layout.module.css";

const AuthLayout = ({ children }) => {
  const { Header, Content } = Layout;

  return (
    <>
      <Layout>
        <Menu className={`${classes.topbar}`} mode="horizontal">
          <Menu.Item key="join">
            <a to="/joinmeeting">Join a meeting</a>
          </Menu.Item>
          <Menu.Item key="Host">
            <a to="/signin">Host a meeting</a>
          </Menu.Item>
          <Menu.Item key="download">
            <Link to="/appdownloadscreen">Download</Link>
          </Menu.Item>
          <Menu.Item key="app">
            <Link to="/support">Support</Link>
          </Menu.Item>
          <Menu.Item key="mail">
            <Link to="/faq">FAQs</Link>
          </Menu.Item>
        </Menu>
        {/* <Header className={classes.header}> <Navbar /> </Header> */}
        <Content className="site-layout mainsec">
          <Outlet />

          {/* <LoginSlider /> */}
        </Content>
      </Layout>
    </>
  );
};

export default AuthLayout;
