import { Progress } from "antd";
import React, { useRef, useState } from "react";
import classes from "./VideoPlayer.module.css";

const VideoPlayer = ({ url }) => {
  const player = useRef(null);
  const [Playing, setPlaying] = useState(false);
  const [playedStatus, setplayedStatus] = useState(0);

  const handleProgress = () => {
    const duration = player.current.duration;
    const currentTime = player.current.currentTime;
    const progress = (currentTime / duration) * 100;
    setplayedStatus(progress);
    console.log(duration, progress);
  };
  return (
    <div className={classes.video_box}>
      <div className={classes.player}>
        <video
          onTimeUpdate={handleProgress}
          ref={player}
          className={`${classes.player_video} ${classes.viewer}`}
          src={url}
        ></video>

        <div className={classes.player_controls}>
          <div className={classes.playSec}>
            <div
              className={classes.playBtn}
              onClick={() => {
                if (Playing) {
                  setPlaying(false);
                  player.current.pause();
                } else {
                  setPlaying(true);
                  player.current.play();
                }
              }}
            >
              {Playing ? (
                <i class="material-symbols-outlined">pause</i>
              ) : (
                <i className={classes.play_icon}></i>
              )}
            </div>
          </div>
          <Progress percent={playedStatus} showInfo={false} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
