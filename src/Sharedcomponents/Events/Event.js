import React from "react";
import { Link } from "react-router-dom";
import classes from "./Event.module.css";

const Event = () => {
  return <div className={classes.eventItem}>
    <img className={classes.eventImg} src={require("../../Assets/Images/png/eventList.png")}/>
    <div className={classes.view}><span class="material-symbols-outlined">visibility</span> 100</div>
    <div className={classes.share}><span class="material-symbols-outlined">share</span></div>
    <div className={classes.contentSec}>
      <h3>Rawcaster Event II</h3>
      <p className={classes.host}>Hosted by John David</p>
      <p className={classes.des}>Lorem ipsum dolor sit amet consectetur. Gravida at sed vel nunc consectetur...</p>
      <p className={classes.iconsec}>
        <span class="material-symbols-outlined">calendar_today</span> 20 Dec 2022 
        <span class="material-symbols-outlined">schedule</span> 10:00 PM - (EST)</p>
      <Link className={classes.link}>Join Event<span class="material-symbols-outlined">arrow_right_alt</span></Link>
    </div>
  </div>;
};

export default Event;