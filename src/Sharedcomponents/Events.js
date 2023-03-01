import React from "react";
import { Link } from "react-router-dom";
import { useAuthData } from "../Shared/Reduxfetcher";
import { removeSessionStorageData } from "../Store/Storage";
import classes from "./Events.module.css";

const Events = () => {
  const loginUserData = useAuthData();
  return (
    <div className={classes.eventSec}>
      {/* BEFORE LOGIN START */}
      <div className={classes.beforelogin}>
        <Link className={classes.active}>
          <span class="material-icons">home</span> For You
        </Link>
        <Link aria-disabled>
          <span class="material-icons">people</span> Following
        </Link>
      </div>
      {loginUserData === null && (
        <>
          <div className={classes.loginSec}>
            <p>Log in to follow creators, like video, and view comments.</p>
            <Link
              className={classes.btn}
              to="/login"
              onClick={() => {
                removeSessionStorageData("influencerData");
              }}
            >
              Log in/Sign up
            </Link>
          </div>

          <div className={classes.eventStatic}>
            <h1>Create a new event</h1>
            <div className={classes.list}>
              <img
                src={require("../Assets/Images/png/eventpic.png")}
                alt="eventpic"
              />
              <Link
                to="/login"
                onClick={() => {
                  removeSessionStorageData("influencerData");
                }}
              >
                Login/Signup to continue{" "}
                <span class="material-icons">arrow_forward</span>
              </Link>
            </div>
          </div>
        </>
      )}
      {/* END */}
    </div>
  );
};

export default Events;
