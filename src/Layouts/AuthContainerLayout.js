import React from "react";
import { Outlet } from "react-router";
import classes from "./Layout.module.css";

const AuthContainerLayout = () => {
  return (
    <div className={classes.Authcontainer}>
      <img src={require("../Assets/Images/png/rawcater_logo.png")} />
      <h1>Welcome to Rawcaster</h1>
      <p>
        Log in now to access the latest insights, experience for your social
        media performance.
      </p>
      <Outlet />
      <p className={classes.linkTxt}>
        Already Registered? <span>Login</span>
      </p>
      <div className={classes.AuthfooterSec}>
        <img src={require("../Assets/Images/png/r_logo.png")} />
        <div>
          <p>© Copyright Rawcaster 2021</p>
          <p>Terms and Conditions | Privacy Policy | Cookies Policy</p>
        </div>
      </div>
    </div>
  );
};

export default AuthContainerLayout;
