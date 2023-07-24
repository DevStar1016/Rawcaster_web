import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { handlenuggetVideoPaused } from "../../Store/Redux/Reducer/NuggetsReducer";
import VideoThumb from "../../Assets/Images/Video_preview.jpg";
import { useDispatch } from "react-redux";
import classes from "./Event.module.css";

export default function EventStartModal({
  openmodal,
  close,
  onStart,
  type = "Start Hosting",
}) {
  const dispatch = useDispatch();

  return (
    <Modal
      footer={null}
      centered
      open={openmodal}
      destroyOnClose
      onCancel={close}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ display: "grid" }}
      >
        <div className={classes.videoHeader}>Rawcaster Event</div>
        <div style={{ display: "grid", padding: "15px 0px" }}>
          <video
            id="dashboard_signup_video"
            className={classes.videoPlayer}
            controls
            disablePictureInPicture
            playsInline
            autoPlay
            controlsList="nodownload"
            poster={VideoThumb}
            onPlayCapture={() => {
              dispatch(handlenuggetVideoPaused(true));
            }}
          >
            <source src="https://rawcaster.s3.us-west-2.amazonaws.com/nuggets/video_47841690153307.mp4" />
          </video>
          <Button className={classes.startBtn} onClick={onStart}>
            {type}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
