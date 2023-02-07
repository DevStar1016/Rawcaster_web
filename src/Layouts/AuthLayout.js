import { Col, Layout, Menu, Row } from "antd";
import React from "react";
import { Outlet } from "react-router";
import LoginSlider from "../Components/AuthComponents/LoginSlider";
import Navbar from "../Components/Navbar";
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
          <Row>
            <Col md={12}>
              <Outlet />
            </Col>
            <Col md={12}>
              <LoginSlider />
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default AuthLayout;
