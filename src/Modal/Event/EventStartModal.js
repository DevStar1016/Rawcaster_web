import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { handlenuggetVideoPaused } from "../../Store/Redux/Reducer/NuggetsReducer";
import VideoThumb from "../../Assets/Images/Video_preview.jpg";
import { useDispatch } from "react-redux";
import classes from "./Event.module.css";

export default function EventStartModal({ openmodal, close, onStart }) {
  const dispatch = useDispatch();
  const [Controlls, setControlls] = useState(false);

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
            // controls={Controlls}
            disablePictureInPicture
            playsInline
            autoPlay
            controlsList="nodownload"
            poster={VideoThumb}
            // onPlayingCapture={() => {
            //   if (player && player.id !== `dashboard_signup_video`) {
            //     player.pause();
            //   }
            //   const video = document.getElementById(`dashboard_signup_video`);
            //   setplayer(video);
            // }}
            onPlayCapture={() => {
              dispatch(handlenuggetVideoPaused(true));
              setControlls(true);
            }}
          >
            <source src="https://rawcaster.com/rawadmin/uploads/default/myluckyzone.mp4" />
          </video>
          <Button className={classes.startBtn} onClick={onStart}>
            Start Hosting
          </Button>
        </div>
      </div>
    </Modal>
  );
}
