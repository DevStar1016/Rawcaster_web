import { Popover } from "antd";
import React from "react";

import Header from "./Header";
import ContentLayout from "./ContentLayout";

const Notification = ({ className, src }) => {
  return (
    <Popover
      placement="bottom"
      title={Header}
      content={ContentLayout}
      showArrow={false}
      trigger="click"
      align="end"
    >
      <img src={src} alt="Notification_logo" className={className} />
    </Popover>
  );
};

export default Notification;
