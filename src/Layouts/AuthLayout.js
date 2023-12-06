/**
 * A layout component for authenticated pages.
 * @param {React.ReactNode} children - The child components to render within the layout.
 * @returns The layout component with the provided child components.
 */
import { Layout, Menu } from "antd";
import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import classes from "./Layout.module.css";
import { IS_CHIME_ENABLE } from "../Shared/Constant";

const AuthLayout = ({ children }) => {
  const { Header, Content } = Layout;

  return (
    <>
      <Layout>
        <div className={`${classes.topbar}`}>
          <Menu mode="horizontal">
            {IS_CHIME_ENABLE && (
              <>
                <Menu.Item key="join">
                  <Link to="/joinmeeting">Join a meeting</Link>
                </Menu.Item>
                <Menu.Item key="Host">
                  <Link to="/login">Host a meeting</Link>
                </Menu.Item>
              </>
            )}
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
        <Content className="site-layout mainsec">
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};

export default AuthLayout;
