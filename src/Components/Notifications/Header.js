import React from "react";
import classes from "./Notification.module.css";
import { useNotificationContext } from "../../Shared/Context";

const Header = () => {
  const { handleViewNotification, setmarkallAsRead, TotalUnreadCount } =
    useNotificationContext();
  return (
    <div className={classes.headingSec}>
      <div className={classes.leftSec}>
        <h2>Notifications</h2>
        {TotalUnreadCount !== 0 && <p>{TotalUnreadCount}</p>}
      </div>
      <div
        className={classes.markSec}
        style={{ display: !TotalUnreadCount ? "none" : "" }}
        onClick={() => {
          if (TotalUnreadCount !== 0) {
            handleViewNotification(null, 1);
          }
        }}
      >
        Mark all as read
      </div>
    </div>
  );
};

export default Header;
