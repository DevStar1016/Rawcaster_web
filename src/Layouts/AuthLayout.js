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
        <div className={`${classes.topbar}`}>
          <Menu mode="horizontal">
            <Menu.Item key="join">
              <Link to="/joinmeeting">Join a meeting</Link>
            </Menu.Item>
            <Menu.Item key="Host">
              <Link to="/login">Host a meeting</Link>
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
        </div>
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
