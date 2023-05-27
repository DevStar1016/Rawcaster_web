import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useDashboard } from "../../Shared/Reduxfetcher";
import AudioPlay from "../../Assets/Icons/audio_play.gif";
import AudioPause from "../../Assets/Images/png/audio_pause.png";
import classes from "./Audioplayer.module.css";
import { handleisNuggetMuted } from "../../Store/Redux/Reducer/NuggetsReducer";

const AudioPlayer = ({ url, isThumb = false, audioId, isPreview }) => {
  const { isNuggetMuted } = useDashboard();
  const dispatch = useDispatch();
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setisMuted] = useState(false);

  useEffect(() => {
    const audioElement = new Audio(url);
    audioElement.id = audioId;
    setAudio(audioElement);
    if (!isPreview) {
      audioElement.muted = isNuggetMuted;
      setisMuted(isNuggetMuted);
    }
    return () => {
      audioElement.pause();

      setAudio(null);
    };
  }, [url]);

  useEffect(() => {
    if (audio) {
      if (!isPreview) {
        audio.muted = isNuggetMuted;
        setisMuted(isNuggetMuted);
      }
    }
  }, [audio, isNuggetMuted]);

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

  function toggleMute() {
    if (audio) {
      if (!isPreview) {
        audio.muted = !isNuggetMuted;
        setisMuted(!isNuggetMuted);
        dispatch(handleisNuggetMuted(!isNuggetMuted));
      } else {
        audio.muted = !isMuted;
        setisMuted(!isMuted);
      }
    }
  }

  // useEffect(() => {
  //   if (audio) {
  //     audio.muted = isMuted;
  //   }
  // }, [audio]);

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
          <div
            className={`${classes.playSec} ${isThumb ? classes.thumbSec : ""}`}
          >
            <div className={classes.overlaySec}>
              {isPlaying ? <img src={AudioPlay} /> : <img src={AudioPause} />}
            </div>
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className={isPlaying ? classes.Playing : ""}
              disabled={isThumb}
            >
              {isPlaying ? (
                <span class="material-symbols-outlined">pause</span>
              ) : (
                <span class="material-symbols-outlined">play_arrow</span>
              )}
            </button>
          </div>
          {!isThumb && (
            <div className={classes.sliderSec}>
              <div className={classes.controlSec}>
                <div className={classes.timeSec}>
                  <span>{formatTime(currentTime)}</span> /{" "}
                  <span>
                    {isNaN(parseInt(duration)) ? "-" : formatTime(duration)}
                  </span>
                </div>
                <div className={classes.muteSec} onClick={() => toggleMute()}>
                  <i
                    className={
                      isMuted ? classes.un_mute_icon : classes.mute_icon
                    }
                  ></i>
                </div>
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
          )}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
