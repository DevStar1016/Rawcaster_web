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
        <div className={classes.footer}>
    <div className={classes.footer_inner}>
      <div className={classes.leftSec}>
       <img src={mainlogo} />
        <Link className={classes.contactSupport} to="/support">
          Contact Support
        </Link>
      </div>

      {/* <div className={classes.leftSec}>
        <img
          className={classes.r_logo}
          src={require("../../assets/r_logo.png")}
        />
        © Copyright Rawcaster 2021
      </div> */}
      <div className={classes.rightSec}>
       
        <ul className={classes.menu}>
          <li>
            <Link to="#">Terms and Conditions</Link>
          </li>
          <li>
            <Link to="#">Privacy Policy</Link>
          </li>
          <li>
            <Link to="#">Support</Link>
          </li>
          <li>
            <Link to="#">Cookies Policy</Link>
          </li>
        </ul>
      </div>
    </div>
    </div>

      </Content>
    </Layout>
  );
};

export default MainLayout;
