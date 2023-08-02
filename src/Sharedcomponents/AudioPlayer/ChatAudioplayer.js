import React, { memo, useEffect, useRef, useState } from "react";
import classes from "./Audioplayer.module.css";
import moment from "moment";
import ReactPlayer from "react-player";
import { Spinner } from "react-bootstrap";

const ChatAudioplayer = ({ url = "", time, textColor = "#000000" }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [FormattedTime, setFormattedTime] = useState("00:00");
  const [isBuffering, setisBuffering] = useState(false);
  const duration = 0;

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    const player = audioRef.current;
    const seekToSeconds = player.getDuration() * (value / 100);
    player.seekTo(seekToSeconds);
  };

  useEffect(() => {
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener("loadedmetadata", () => {
      setAudioUrl(audio.src);
    });

    return () => {
      audio.removeEventListener("loadedmetadata", () => {
        setAudioUrl(audio.src);
      });
    };
  }, [url]);

  const handleProgress = (e) => {
    const played = e.played * 100;
    setCurrentTime(played);
    const duration = moment.duration(e.playedSeconds, "seconds");
    setFormattedTime(moment.utc(duration.asMilliseconds()).format("mm:ss"));
  };

  return (
    <div className={classes.audio_slider_container}>
      <ReactPlayer
        ref={audioRef}
        url={audioUrl}
        playing={isPlaying}
        controls={false}
        onEnded={() => {
          setisPlaying(false);
        }}
        onBuffer={() => {
          setisBuffering(true);
          setisPlaying(false);
        }}
        onBufferEnd={() => {
          setisBuffering(false);
        }}
        onPlay={() => {
          setisPlaying(true);
        }}
        onProgress={handleProgress}
        style={{
          display: "none",
        }}
      />

      {/* <AudioPlayer src={audioUrl} /> */}

      <div className="w-100 d-flex flex-row align-items-center justify-content-center">
        {isBuffering ? (
          <div className={classes.spinnerSec}>
            <Spinner animation="border" />
          </div>
        ) : (
          <div className={classes.pauseplaySec}>
            {isPlaying ? (
              <i
                className={classes.pause_icon}
                onClick={() => {
                  setisPlaying(false);
                }}
              />
            ) : (
              <i
                className={classes.play_icon}
                onClick={() => {
                  setisPlaying(true);
                }}
              />
            )}
          </div>
        )}
        <div className={classes.sliderSec}>
          <input
            type="range"
            className={classes.audio_slider}
            min={0}
            max={100}
            value={currentTime}
            onChange={handleSliderChange}
            style={{
              background: `linear-gradient(to right, #563662 ${currentTime}%, #D4D8E3 ${currentTime}%)`,
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
