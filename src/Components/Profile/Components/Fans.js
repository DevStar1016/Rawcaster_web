import React from "react";
import classes from "./ProfilerRight.module.css";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";


const Fans = () => {
  return <div className={classes.profileThumb}>
  <h2>Fans (600) 
      <img className={classes.actionIcon} src={msgIcon} />
      <img className={classes.actionIcon} src={talkshowIcon} />
    <span>See All</span>
  </h2>
  
  <div className={classes.listSec}>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  <div className={classes.list}>
    <img src={require("../../../Assets/Images/png/pro_img.png")} />
    <p>Solomon</p>
  </div>
  </div>

</div>;
};

export default Fans;
