import React from "react";
import ChangePassword from "../Auth/ChangePassword";
import classes from "./Settings.module.css";

const Changepassword = () => {
  return (
    <div>
      <h1>Change Password</h1>
      <div className={`${classes.item} ${classes.mb0}`}>
        <p className={classes.smallheading}>Create a new password</p>
        <p className={classes.text}>
          Replace your exiting password. Do not share password with anyone else.
          Use special characters and alphanumeric for a stronger password.
        </p>
      </div>

      <ChangePassword />
    </div>
  );
};

export default Changepassword;
