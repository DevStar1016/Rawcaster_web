import React, { useEffect, useState } from "react";
import classes from "./Stickypopup.module.css";
import { Layout } from "antd";
import Footer from "../../Components/ChatBox/Footer";

const { Header } = Layout;

const StickyPopup = ({ HeaderContainer, Content, open, close }) => {
  const [isHidden, setisHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setisHidden(!open);
    }, 500);
  }, [open]);

  return !isHidden ? (
    <div className={`${classes.sticky_popup} ${open ? classes.visible : ""}`}>
      <Layout className={classes.content}>
        <HeaderContainer
          onClose={() => {
            close();
          }}
        />
        <Layout.Content>Content </Layout.Content>
        <Footer />
      </Layout>
    </div>
  ) : (
    <></>
  );
};

export default StickyPopup;
