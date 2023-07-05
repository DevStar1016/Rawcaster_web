import React, { useEffect, useRef, useState } from "react";
import classes from "./Audioplayer.module.css";
import moment from "moment";

const ChatAudioplayer = ({ url = "", time, textColor = "#000000" }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [FormattedTime, setFormattedTime] = useState("00:00");

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime);
    setFormattedTime(
      moment.utc(audioRef.current?.currentTime * 1000).format("mm:ss")
    );
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current?.duration)) {
      setDuration(audioRef.current?.duration);
    }
  };

  const handleSliderChange = (e) => {
    const newTime = (parseInt(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (audioRef.current.currentTime) {
      audioRef.current.currentTime = newTime;
    }
  };

  async function getDuration() {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      const source = document.createElement("source");
      source.src = url; //--> blob URL
      audio.preload = "metadata";
      audio.appendChild(source);
      audio.onloadedmetadata = function () {
        resolve(audio.duration);
      };
    });
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      audioRef.current.addEventListener("loadedmetadata", () => {
        const totalDuration = audioRef.current?.duration;
        console.log("Total duration:", totalDuration, audioRef);
      });
      audioRef.current.addEventListener("durationchange", handleTimeUpdate);
    }
  }, [audioRef.current]);

  return (
    <div className={classes.audio_slider_container}>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={(e) => {
          console.log(e.target?.duration);
        }}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="w-100 d-flex flex-row align-items-center justify-content-center">
        <div className={classes.pauseplaySec}>
          {!audioRef.current?.paused ? (
            <i
              className={classes.pause_icon}
              onClick={() => {
                audioRef.current?.pause();
              }}
            />
          ) : (
            <i
              className={classes.play_icon}
              onClick={() => {
                audioRef.current?.play();
              }}
            />
          )}
        </div>
        <div className={classes.sliderSec}>
          <input
            type="range"
            className={classes.audio_slider}
            min={0}
            max={100}
            value={((currentTime / duration) * 100).toFixed(0)}
            onChange={handleSliderChange}
            style={{
              background: `linear-gradient(to right, #563662 0%, #563662 ${(
                (currentTime / duration) *
                100
              ).toFixed(0)}%, #D4D8E3 ${(
                (currentTime / duration) *
                100
              ).toFixed(0)}%, #D4D8E3 100%)`,
            }}
          />
          <div className={`${classes.timeSec} ${classes.chatTimeSec}`}>
            <span
              className={classes.chatTime}
              style={{
                color: textColor,
              }}
            >
              {FormattedTime}
            </span>
            {time && (
              <span
                className={classes.chatTime}
                style={{
                  color: textColor,
                }}
              >
                {time}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAudioplayer;
