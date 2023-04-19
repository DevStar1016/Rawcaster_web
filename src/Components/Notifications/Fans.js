import React from "react";
import profileImg from "../../Assets/Images/svg/profile_img.svg";
import classes from "./Notification.module.css";

const Fans = () => {
  return (
    <div className={classes.listSec}>
      {[...Array(6)].map((ele) => (
        <div className={classes.fansList}>
          <div className={classes.leftsec}>
            <img src={profileImg} />
            <div>
              <p>Godfrey Gad</p>
              <span>Posted a new event</span>
            </div>
          </div>
          <div className={classes.rightsec}>15 min ago</div>
        </div>
      ))}
    </div>
  );
};

export default Fans;
