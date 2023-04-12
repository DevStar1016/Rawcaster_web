import React from "react";
import classes from "./Notification.module.css";

const Header = () => {
  return (
    <div className={classes.headingSec}>
      <div className={classes.leftSec}>
        <h2>Notifications</h2>
        <p>20</p>
      </div>
      <div className={classes.markSec}>Mark as read</div>
    </div>
  );
};

export default Header;
