import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./Events.module.css";

const Events = () => {
  return (
    <div className={classes.eventSec}>
      {/* BEFORE LOGIN START */}
      <div className={classes.beforelogin}>
        <Link className={classes.active}>
          <span class="material-icons">home</span> For You
        </Link>
        <Link>
          <span class="material-icons">people</span> Following
        </Link>
      </div>

      <div className={classes.loginSec}>
        <p>Log in to follow creators, like video, and view comments.</p>
        <Link className={classes.btn} to="/login">
          Log in/Sign up
        </Link>
      </div>

      <div className={classes.eventStatic}>
        <h1>Create a new event</h1>
        <div className={classes.list}>
          <img src={require("../Assets/Images/png/eventpic.png")} />
          <Link to="/login">
            Login/Signup to continue{" "}
            <span class="material-icons">arrow_forward</span>
          </Link>
        </div>
      </div>
      {/* END */}
    </div>
  );
};

export default Events;
