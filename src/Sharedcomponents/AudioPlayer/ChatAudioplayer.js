/**
 * A custom audio player component for chat messages.
 * @param {string} url - The URL of the audio file to play.
 * @param {string} time - The time duration of the audio file.
 * @param {string} textColor - The color of the text displayed on the player.
 * @returns The ChatAudioplayer component.
 */
import { useEffect, useRef, useState } from "react";
import classes from "./Audioplayer.module.css";
import moment from "moment";
import ReactPlayer from "react-player";
import { Spinner } from "react-bootstrap";

const ChatAudioplayer = ({ url = "", id, time, textColor = "#000000" }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [FormattedTime, setFormattedTime] = useState("00:00");
  const [isBuffering, setisBuffering] = useState(false);

  /**
   * Handles the change event of a slider input element.
   * @param {Event} e - The event object.
   * @returns None
   */
  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    const player = audioRef.current;
    const seekToSeconds = player.getDuration() * (value / 100);
    player.seekTo(seekToSeconds);
  };

  /**
   * useEffect hook that sets up an audio element with the given URL and listens for the "loadedmetadata" event.
   * When the event is triggered, it updates the audio URL state.
   * @param {string} url - The URL of the audio file.
   * @returns None
   */
  useEffect(() => {
    if (url) {
      const audio = new Audio(url);
      audio.id = id;
      audio.addEventListener("loadedmetadata", () => {
        console.log("loadedmetadata");
        setAudioUrl(url);
      });

      return () => {
        audio.removeEventListener("loadedmetadata", () => {});
      };
    }
  }, [url]);

  /**
   * Handles the progress event of a media player.
   * @param {object} e - The progress event object.
   * @returns None
   */
  const handleProgress = (e) => {
    const played = e.played * 100;
    setCurrentTime(played);
    const duration = moment.duration(e.playedSeconds, "seconds");
    setFormattedTime(moment.utc(duration.asMilliseconds()).format("mm:ss"));
  };

  return (
    <div className={classes.audio_slider_container}>
      {audioUrl && (
        <ReactPlayer
          ref={audioRef}
          url={audioUrl}
          playing={isPlaying}
          onError={(err) => {
            console.log(err);
          }}
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
      )}

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
