import React, { memo, useEffect, useRef, useState } from "react";
import classes from "./Audioplayer.module.css";
import moment from "moment";
const ChatAudioplayer = ({ url = "", time, textColor = "#000000" }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [Duration, setDuration] = useState(0);
  const [FormattedTime, setFormattedTime] = useState("00:00");
  const duration = 0;

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime);
    setFormattedTime(
      moment.utc(audioRef.current?.currentTime * 1000).format("mm:ss")
    );
  };

  const handleLoadedMetadata = async () => {
    console.log(audioRef.current.duration);
    setDuration(audioRef.current.duration);
  };

  const handleSliderChange = (e) => {
    const newTime = (parseInt(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (audioRef.current.currentTime) {
      audioRef.current.currentTime = newTime;
    }
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

  useEffect(() => {
    if (currentTime) {
      setFormattedTime(moment.utc(currentTime * 1000).format("mm:ss"));
    }
  }, [currentTime]);

  // useEffect(() => {
  //   if (url) {
  //     load(url, {
  //       autoplay: false,
  //     });
  //     console.log(duration, "getduration");
  //   }
  // }, [url]);

  const AudioPlayer = memo(({ src }) => {
    const handleLoadedMetadata = async (event) => {
      const { duration } = event.target;
      console.log(isNaN(duration));
      if (isFinite(duration)) {
        console.log(duration, "duration");
      }
    };
    return (
      <audio
        ref={audioRef}
        id="audionugget"
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={(e) => {
          console.log(e);
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    );
  });

  return (
    <div className={classes.audio_slider_container}>
      <AudioPlayer src={audioUrl} />

      <div className="w-100 d-flex flex-row align-items-center justify-content-center">
        <div className={classes.pauseplaySec}>
          {audioRef.current && !audioRef.current?.paused ? (
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
            value={
              audioRef.current ? ((currentTime / Duration) * 100).toFixed(0) : 0
            }
            onChange={handleSliderChange}
            style={{
              background: `linear-gradient(to right, #563662 0%, #563662 ${(
                (currentTime / Duration) *
                100
              ).toFixed(0)}%, #D4D8E3 ${(
                (currentTime / Duration) *
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

      {/* <ReactAudioPlayer src={url} controls /> */}
      {/* <div className={classes.audioPlayer}>
        <audio src={url}></audio>
        <div className={classes.controls}>
          <button className={`playerButton ${classes.playerButton}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#3D3132"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <input
            type="range"
            className={`timeline ${classes.timeline}`}
            max="100"
            value="0"
          />
        </div>
      </div>

      {/* <AudioPlayer
        // autoPlay
        src={url}
        onPlay={(e) => console.log("onPlay")}
        // other props here
        showJumpControls={false}
        showFilledProgress={false}
        loop={false}
        showFilledVolume={false}
      /> */}
    </div>
  );
};

export default ChatAudioplayer;

// async function getDuration() {
//   return new Promise((resolve) => {
//     const audio = document.createElement("audio");
//     const source = document.createElement("source");
//     source.src = url; //--> blob URL
//     audio.preload = "metadata";
//     audio.appendChild(source);
//     audio.onloadedmetadata = function () {
//       resolve(audio.duration);
//     };
//   });
// }

// useEffect(() => {
//   if (audioRef.current) {
//     audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

//     audioRef.current.addEventListener("loadedmetadata", () => {
//       const totalDuration = audioRef.current?.duration;
//       console.log(
//         "Total duration:",
//         totalDuration,
//         audioRef?.current.duration,
//         audioRef
//       );
//     });
//     audioRef.current.addEventListener("durationchange", handleTimeUpdate);
//   }
// }, [audioRef.current]);

// useEffect(() => {
//   const playerButton = document.querySelector(".playerButton"),
//     audio = document.querySelector("audio"),
//     timeline = document.querySelector(".timeline"),
//     playIcon = `
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
//     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
//   </svg>
//       `,
//     pauseIcon = `
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
//   <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
// </svg>
//       `,
//     soundIcon = `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
//   <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
// </svg>`,
//     muteIcon = `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
//   <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
// </svg>`;

//   function toggleAudio() {
//     console.log("toggle");
//     if (audio.paused) {
//       audio.play();
//       playerButton.innerHTML = pauseIcon;
//     } else {
//       audio.pause();
//       playerButton.innerHTML = playIcon;
//     }
//   }

//   playerButton.addEventListener("click", toggleAudio);

//   function changeTimelinePosition() {
//     const percentagePosition = (100 * audio.currentTime) / audio.duration;
//     timeline.style.backgroundSize = `${percentagePosition}% 100%`;
//     timeline.value = percentagePosition;
//   }

//   audio.ontimeupdate = changeTimelinePosition;

//   function audioEnded() {
//     playerButton.innerHTML = playIcon;
//   }

//   audio.onended = audioEnded;

//   function changeSeek() {
//     const time = (timeline.value * audio.duration) / 100;
//     audio.currentTime = time;
//   }

//   timeline.addEventListener("change", changeSeek);
// }, []);
