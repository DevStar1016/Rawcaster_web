import React, { useState } from "react";
import userImg from "../Assets/Images/svg/userImg.svg";
import classes from "./Dev.module.css";
// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const Development = () => {
  const [MeetingId, setMeetingId] = useState("");
  return (
    <>
      <div className="h-100 p-5 mt-5 m-auto w-100">
        <button
          className="mx-2"
          onClick={() => {
            window.open("/room", "_blank", {
              popup: true,
            });
          }}
        >
          Create Meeting
        </button>
        <input
          className="mx-2"
          placeholder="Enter MeetingId"
          value={MeetingId}
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <button
          className="mx-2"
          onClick={() => {
            window.open(`/room?meetingid=${MeetingId}`, "_blank", {
              popup: true,
            });
          }}
        >
          Join Meeting
        </button>
      </div>
      <div
        style={{
          background: "#563662",
          height: 300,
        }}
      >
        <div className={classes.Child}>
          <img src={userImg} />
          <p>{"participant"}</p>
          <div className={classes.overlaySec}>
            <div className={classes.actionContainer}>
              <span class="material-symbols-outlined">mic</span>
              <span class="material-symbols-outlined">videocam</span>
              <span class="material-symbols-outlined">push_pin</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Development;
