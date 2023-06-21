import React, { useState } from "react";

import classes from "./ChatBox.module.css";

import { Layout } from "antd";
import { ChatInput } from "../../Sharedcomponents/Chat/utility";

const Footer = () => {
  return (
    <Layout.Footer className={classes.footerSec}>
      <ChatInput
        HandleSendMessage={(val) => {
          console.log(val);
        }}
        cameraenabled
        fileuploadEnabled
        onAudioResult={(val) => {
          console.log(val);
        }}
      />
    </Layout.Footer>
  );
};

export default Footer;
