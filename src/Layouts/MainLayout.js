import { Layout, Menu } from "antd";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import classes from "./Layout.module.css";
import mainlogo from "../Assets/Images/svg/rawcaster_logo.svg";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const MainLayout = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const { Header, Content } = Layout;
  const navigate = useNavigate();
  return (
    <div className={classes.main_menu} mode="horizontal">
      <Layout>
        <div className={`${classes.topbar} ${classes.onlydes}`}>
          <div className={classes.headermargin}>
            <Menu mode="horizontal">
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
          </div>
        </div>

        <div className={classes.mobmenu}>
          <div className={classes.mobheader}>
            <img
              className={classes.moblogo}
              alt={"Rawcaster"}
              src={require("../Assets/Images/png/mob-rlogo.png")}
            />
            <div className={classes.rightmenu}>
              <ul>
                <li>
                  <Link to="#">Join</Link>
                </li>
                <li>
                  <Link to="#">Host</Link>
                </li>
              </ul>
              <i onClick={showDrawer} className="material-icons">
                menu
              </i>
            </div>
          </div>

          <Drawer
            width="250px"
            placement="right"
            className={classes.sidemenu}
            closable={false}
            onClose={onClose}
            visible={visible}
          >
            <img
              width="100%"
              className={classes.mainlogo}
              src={mainlogo}
              alt={"Rawcaster"}
            />
            <p>
              <Link to="/login" onClick={onClose}>
                LOGIN
              </Link>
            </p>
            <p>
              <Link to="/signup" onClick={onClose}>
                SIGN UP
              </Link>
            </p>
            <p>
              <Link to="/faq" onClick={onClose}>
                FAQ
              </Link>
            </p>
            <p>
              <Link to="/appdownloadscreen" onClick={onClose}>
                DOWNLOAD
              </Link>
            </p>
            <p>
              <Link to="/support" onClick={onClose}>
                SUPPORT
              </Link>
            </p>
          </Drawer>
        </div>

        {/* <Header className={classes.header}> <Navbar /> </Header> */}
        <Content className="site-layout mainsec">
          <div className={`${classes.homeheader} ${classes.onlydes}`}>
            <div className={classes.headermargin}>
              <img
                className={classes.mainlogo}
                src={mainlogo}
                alt={"Rawcaster"}
                onClick={() => {
                  navigate("/");
                }}
              />
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
          </div>
          <Outlet />

          {/* <LoginSlider /> */}
          <div className={classes.footer}>
            <div className={classes.footer_inner}>
              <div className={classes.leftSec}>
                <img
                  src={mainlogo}
                  alt={"Rawcaster"}
                  onClick={() => {
                    navigate("/");
                  }}
                />
                {!pathname.includes("support") && (
                  <Link className={classes.contactSupport} to="/support">
                    Contact Support
                  </Link>
                )}
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
                  <li
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Link to="/termsandconditions">Terms and Conditions</Link>
                  </li>
                  <li
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Link to="/privacypolicy">Privacy Policy</Link>
                  </li>
                  <li
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Link to="/support">Support</Link>
                  </li>
                  <li
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Link to="/cookiespolicy">Cookies Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default MainLayout;
