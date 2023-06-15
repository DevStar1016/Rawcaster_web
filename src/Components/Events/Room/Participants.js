import React from "react";
import classes from "./Room.module.css";

const Participants = () => {
  return (
    <div className={classes.popupContainer}>
      <div className={classes.popupHeader}>
        <div>
          <i className={classes.participant_icon}></i> <p>Participants</p>
        </div>
        <div>
          <i className={classes.participant_icon}></i> <p>Participants</p>
        </div>
      </div>
    </div>
  );
};

export default Participants;
