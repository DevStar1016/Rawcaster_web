import React from "react";
import useAudioPlayer from "./useAudioPlayer";
import classes from "./Audioplayer.module.css";
const AudioPlayer = ({ url }) => {
  const { curTime, duration, playing, setPlaying, setClickedTime } =
    useAudioPlayer();
  // const curPercentage = (curTime / duration) * 100;

  // function calcClickedTime(e) {
  //   const clickPositionInPage = e.pageX;
  //   const bar = document.querySelector("#bar__progress");
  //   const barStart = bar.getBoundingClientRect().left + window.scrollX;
  //   const barWidth = bar.offsetWidth;
  //   const clickPositionInBar = clickPositionInPage - barStart;
  //   const timePerPixel = duration / barWidth;
  //   return timePerPixel * clickPositionInBar;
  // }

  // function handleTimeDrag(e) {
  //   setClickedTime(calcClickedTime(e));

  //   const updateTimeOnMove = (eMove) => {
  //     setClickedTime(calcClickedTime(eMove));
  //   };

  //   document.addEventListener("mousemove", updateTimeOnMove);

  //   document.addEventListener("mouseup", () => {
  //     document.removeEventListener("mousemove", updateTimeOnMove);
  //   });
  // }

  return (
    <div className={classes.audioSec}>
      <audio id="audio">
        <source src={"http://webaudioapi.com/samples/audio-tag/chrono.mp3"} />
        Your browser does not support the <code>audio</code> element.
      </audio>
      {/*
      <div className={classes.controls}>
        <div className={classes.pausePlayBtn}>
          {playing ? (
            <div onClick={() => setPlaying(false)}>pause</div>
          ) : (
            <div onClick={() => setPlaying(true)}>play</div>
          )}
        </div>
        <div className={classes.barSec}>
          <div className={classes.timeSec}>
            <span className={classes.bar__time}>{curTime}</span>/
            <span className={classes.bar__time}>{duration}</span>
          </div>
          <div className={classes.bar}>
            <div
              id="bar__progress"
              className={classes.bar__progress}
              style={{
                background: `linear-gradient(to right, orange ${curPercentage}%, rgba(255, 255, 255, 0.4) 0)`,
              }}
              onMouseDown={(e) => handleTimeDrag(e)}
            >
              <span
                className={classes.bar__progress__knob}
                style={{ left: `${curPercentage - 2}%` }}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AudioPlayer;
