import React, { useEffect, useState } from "react";
import classes from "./Audioplayer.module.css";

const AudioPlayer = ({ url }) => {
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = new Audio(url);
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      setAudio(null);
    };
  }, [url]);

  useEffect(() => {
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audio]);

  function handleTimeUpdate() {
    setCurrentTime(audio.currentTime);
  }

  function handleDurationChange() {
    setDuration(audio.duration);
  }

  function handleSeek(event) {
    if (audio) {
      audio.currentTime = event.target.value;
    }
  }

  function handlePlay() {
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  }

  function handlePause() {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleEnded() {
    setIsPlaying(false);
    // setCurrentTime(0);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  }

  return (
    <div className={classes.audio_player}>
      {audio && (
        <div>
          <div className={classes.sliderSec}>
            <div className={classes.timeSec}>
              <span>{formatTime(currentTime)}</span> /{" "}
              <span>
                {isNaN(parseInt(duration)) ? "-" : formatTime(duration)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.round(duration)}
              value={Math.round(currentTime)}
              onChange={handleSeek}
              aria-label="Audio Seekbar"
            />
          </div>
          <div className={classes.playSec}>
            <button onClick={isPlaying ? handlePause : handlePlay}>
              {isPlaying ? (
                <span class="material-symbols-outlined">pause</span>
              ) : (
                <span class="material-symbols-outlined">play_arrow</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
