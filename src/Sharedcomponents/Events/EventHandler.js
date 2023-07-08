import React from "react";
import classes from "./Event.module.css";

const EventHandler = ({ title, isHost, meetingId }) => {
  const handleJoinEvent = async (e) => {
    e.stopPropagation();
    window.open(`/room/${meetingId}`, "_blank", {
      popup: true,
    });
  };
  return (
    <div
      className={classes.link}
      onClick={(e) => {
        handleJoinEvent(e);
      }}
    >
      {isHost ? `Start ${title}` : `Join ${title}`}
      <span className="material-symbols-outlined">arrow_right_alt</span>
    </div>
  );
};

export default EventHandler;
