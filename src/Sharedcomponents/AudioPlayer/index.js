/**
 * A component that renders an audio player with controls such as play/pause, mute/unmute, and a seekbar.
 * @param {string} url - The URL of the audio file to play.
 * @param {boolean} [isThumb=false] - Indicates whether the audio player is being used as a thumbnail.
 * @param {string} audioId - The ID of the audio element.
 * @param {boolean} isPreview - Indicates whether the audio player is in preview mode.
 * @returns The rendered audio player component.
 */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useDashboard } from "../../Shared/Reduxfetcher";
import AudioPlay from "../../Assets/Icons/audio_play.gif";
import AudioPause from "../../Assets/Images/png/audio_pause.png";
import classes from "./Audioplayer.module.css";
import { handleisNuggetMuted } from "../../Store/Redux/Reducer/NuggetsReducer";
import { useMainContext } from "../../Shared/Context";
import { Spinner } from "react-bootstrap";

const AudioPlayer = ({
  url,
  isThumb = false,
  audioId,
  isPreview,
  isDownloadEnable = false,
}) => {
  const { isNuggetMuted } = useDashboard();
  const dispatch = useDispatch();
  const { player, setplayer } = useMainContext();
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setisMuted] = useState(false);
  const [isBuffering, setisBuffering] = useState(false);

  /**
   * useEffect hook that creates an audio element with the given URL and sets it as the audio state.
   * If isPreview is false, it also sets the audio element's muted property to isNuggetMuted and updates the isMuted state accordingly.
   * When the component unmounts, the audio element is paused and the audio state is set to null.
   * @param {string} url - The URL of the audio file.
   * @returns None
   */
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

  /**
   * React useEffect hook that updates the audio element's muted property and the state
   * of isMuted based on the value of isNuggetMuted.
   * @param {HTMLAudioElement} audio - The audio element to update.
   * @param {boolean} isPreview - Flag indicating if the audio is in preview mode.
   * @param {boolean} isNuggetMuted - Flag indicating if the audio is muted.
   * @returns None
   */
  useEffect(() => {
    if (audio) {
      if (!isPreview) {
        audio.muted = isNuggetMuted;
        setisMuted(isNuggetMuted);
      }
    }
  }, [audio, isNuggetMuted]);

  /**
   * Sets up event listeners on the audio element to handle various audio events.
   * @param {HTMLAudioElement} audio - The audio element to attach the event listeners to.
   * @returns None
   */
  useEffect(() => {
    if (audio) {
      audio.addEventListener("pause", () => {
        setIsPlaying(false);
      });
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadstart", (e) => {
        setisBuffering(true);
      });
      // audio.addEventListener("waiting", () => {
      //   setisBuffering(true);
      // });
      audio.addEventListener("loadeddata", (e) => {
        setisBuffering(false);
      });

      return () => {
        audio.removeEventListener("pause", () => {
          setIsPlaying(false);
        });
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("ended", handleEnded);
        audio.addEventListener("loadstart", (e) => {
          setisBuffering(true);
        });
        audio.addEventListener("loadeddata", (e) => {
          setisBuffering(false);
        });
      };
    }
  }, [audio]);

  /**
   * Updates the current time of the audio player.
   * @returns None
   */
  function handleTimeUpdate() {
    setCurrentTime(audio.currentTime);
  }

  /**
   * Handles the change in duration of the audio.
   * Updates the duration state with the new duration value.
   * @returns None
   */
  function handleDurationChange() {
    setDuration(audio.duration);
  }

  /**
   * Handles the seek event by updating the current time of the audio element.
   * @param {Event} event - The seek event object.
   * @returns None
   */
  function handleSeek(event) {
    if (audio) {
      audio.currentTime = event.target.value;
    }
  }

  /**
   * Handles the play functionality for an audio player.
   * If there is a currently playing audio and it is not the same as the new audio,
   * it will pause the currently playing audio.
   * Sets the new audio as the player.
   * If there is a new audio, it will play it and set the isPlaying state to true.
   * @returns None
   */
  function handlePlay() {
    if (player && player.id !== audioId) {
      player.pause();
    }
    setplayer(audio);
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  }

  /**
   * Pauses the audio playback and updates the state to indicate that the audio is not playing.
   * @returns None
   */
  function handlePause() {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }

  /**
   * Toggles the mute state of the audio element.
   * If the audio element exists, it will toggle the muted property based on the current state.
   * If the isPreview flag is false, it will also update the isMuted state, dispatch a handleisNuggetMuted action,
   * and update the isMuted state again.
   * @returns None
   */
  function toggleMute() {
    if (audio) {
      if (!isPreview) {
        audio.muted = !isMuted;
        setisMuted(!isMuted);
        dispatch(handleisNuggetMuted(!isMuted));
      } else {
        audio.muted = !isMuted;
        setisMuted(!isMuted);
      }
    }
  }

  /**
   * Handles the "ended" event of a media element.
   * Sets the value of "isPlaying" to false.
   * @returns None
   */
  function handleEnded() {
    setIsPlaying(false);
  }

  /**
   * Formats a given number of seconds into a string representation of time in the format "minutes:seconds".
   * @param {number} seconds - The number of seconds to format.
   * @returns {string} The formatted time string.
   */
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
            {!isBuffering && (
              <div className={classes.overlaySec}>
                {isPlaying ? <img src={AudioPlay} /> : <img src={AudioPause} />}
              </div>
            )}
            {isBuffering ? (
              <div className={classes.spinnerSec}>
                <Spinner animation="border" color="#FFFFFF" />
              </div>
            ) : (
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className={isPlaying ? classes.Playing : ""}
                disabled={isThumb}
              >
                {isPlaying ? (
                  <span className="material-symbols-outlined">pause</span>
                ) : (
                  <span className="material-symbols-outlined">play_arrow</span>
                )}
              </button>
            )}
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
                <div className="d-flex align-items-center flex-row">
                  <div className={classes.muteSec} onClick={() => toggleMute()}>
                    <i
                      className={
                        isMuted ? classes.un_mute_icon : classes.mute_icon
                      }
                    ></i>
                  </div>
                  {isDownloadEnable && (
                    <div
                      onClick={() => {
                        if (audio?.src) {
                          window.open(audio?.src);
                        }
                      }}
                      className={`${classes.muteSec} ms-2 d-flex align-items-center justify-content-center`}
                    >
                      <span class="material-symbols-outlined fs-5 lh-0 text-white">
                        download
                      </span>
                    </div>
                  )}
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
