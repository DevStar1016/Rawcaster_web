import React, { useEffect, useState } from "react";
import classes from "./Stickypopup.module.css";
import { Layout } from "antd";
import Footer from "../../Components/ChatBox/Footer";
import Content from "../../Components/ChatBox/Group/Content";

const { Header } = Layout;

const StickyPopup = ({ HeaderContainer, open, close }) => {
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
        <Content />
        <Footer />
      </Layout>
    </div>
  ) : (
    <></>
  );
};

export default StickyPopup;
