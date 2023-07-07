import React from "react";
import classes from "./ArtificialIntelligence.module.css";
import ChatProfile from "../../Assets/Icons/svg/chat_r_logo.svg";

const Heading = ({ onClose }) => {
  return (
    <div className={classes.HeadingSec}>
      <div className="d-flex flex-row align-items-center ">
        <img src={ChatProfile} />
        <p>Rawcaster AI</p>
      </div>
      <span className="material-symbols-outlined" onClick={onClose}>
        close
      </span>
    </div>
  );
};

export default Heading;
