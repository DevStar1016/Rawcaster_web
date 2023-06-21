import React from "react";
import { MessageContent } from "../../../Sharedcomponents/Chat/utility";
import { Layout } from "antd";
import classes from "../ChatBox.module.css";

const Content = () => {
  return (
    <Layout.Content className={classes.mainContainer}>
      {[...new Array(16)].map((ele, index) => {
        return (
          <MessageContent
            message="I commented on Figma, I want to add some fancy icons. "
            user={index === 1 ? 1 : 2}
            index={index}
          />
        );
      })}
    </Layout.Content>
  );
};

export default Content;
