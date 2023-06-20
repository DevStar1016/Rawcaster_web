import React from "react";
import classes from "./ChatBox.module.css";
import { defaultGroupImg } from "../../Shared/CommonConstants";
import { useMainContext } from "../../Shared/Context";
import { Layout } from "antd";

const Header = () => {
  const { isChatOpen, setisChatOpen } = useMainContext();
  return (
    <Layout.Header className={classes.chatboxHeader}>
      <div className={classes.groupintroSec}>
        <img src={defaultGroupImg} />
        <div className={classes.describeSec}>
          <h2>Group name abc</h2>
          <p>you, Gofrey, solomo, 8 others</p>
        </div>
      </div>
      <div>
        <span class="material-symbols-outlined">more_vert</span>
        <span
          class="material-symbols-outlined"
          onClick={() => {
            setisChatOpen(false);
          }}
        >
          close
        </span>
      </div>
    </Layout.Header>
  );
};

export default Header;
