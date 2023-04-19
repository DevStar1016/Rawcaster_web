import { Popover } from "antd";
import React from "react";
import ContentLayout from "./Content";
import Header from "./Header";

const Notification = ({ className, src }) => {
  return (
    <Popover
      placement="bottom"
      title={Header}
      content={ContentLayout}
      showArrow={false}
      // open={NotificationOpen}
      trigger="click"
      align="end"
    >
      <img src={src} alt="Notification_logo" className={className} />
    </Popover>
  );
};

export default Notification;
