import React, { useState, useRef, useEffect } from "react";
import classes from "./ArtificialIntelligence.module.css";
import ChatProfile from "../../Assets/Icons/svg/chat_r_logo.svg";
import { Form, InputGroup } from "react-bootstrap";
import ChatIcon from "../../Assets/Icons/svg/chat_icon.svg";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
} from "mic-check/lib/requestMediaPermissions";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import { useStopwatch } from "react-timer-hook";
import moment from "moment";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { useChatBotContext, useGlobalContext } from "../../Shared/Context";
import { JSONtoformdata, ReadMore } from "../../Shared/Utility";
import { findIndex } from "lodash";
import { TextToAudioService } from "../../Services/ApiService";

export const isUser = (id) => {
  if (parseInt(id) === 1) {
    return true;
  }
  return false;
};

export const ReadoutSec = ({ audiourl, index, message, onResponse }) => {
  const { audio, setAudio, isPlaying, setisPlaying } = useChatBotContext();
  const token = useAuthToken();

  const HandlegetNuggetContentAudio = (url) => {
    if (audio) {
      audio.pause();
    }
    const audioElement = new Audio(url);
    audioElement.id = index;
    setAudio(audioElement);
    audioElement.play();
    setisPlaying(index);
  };

  const handleStopAudio = () => {
    if (audio) {
      audio.pause();
    }
    setisPlaying(null);
  };

  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", function () {
        audio.pause();
        setisPlaying(null);
      });
    }
  }, [audio]);

  const convertToAudio = () => {
    if (audiourl) {
      HandlegetNuggetContentAudio(audiourl);
    } else {
      TextToAudioService(
        JSONtoformdata({
          token,
          message,
        })
      ).then((res) => {
        if (res.data.status === 1) {
          onResponse(res.data.url);
          HandlegetNuggetContentAudio(res.data.url);
        } else {
          toast.error(res.data.msg);
        }
      });
    }
  };

  return isPlaying === index ? (
    <p
      style={{ color: "red" }}
      onClick={() => {
        handleStopAudio();
      }}
    >
      <i class="material-symbols-outlined">mic_off</i>Stop
    </p>
  ) : (
    <p
      onClick={() => {
        convertToAudio();
      }}
    >
      <i className={classes.read_mic_icon}></i>Read Out
    </p>
  );
};

export const MessageContent = (props) => {
  const { setpostModalShow, setPostContent } = useGlobalContext();
  const { message, user, index, read_out_url, OnReadoutResponse } = props;
  console.log(read_out_url);
  const loginUserData = useAuthData();
  return (
    <div
      className={
        isUser(user) ? classes.MessageContainer : classes.receiverConteiner
      }
    >
      <div
        key={index}
        className={`${classes.chatbox_message} ${
          isUser(user) ? classes.user_chatbox_message : ""
        }`}
      >
        <div className={classes.avatar}>
          <img
            src={isUser(user) ? loginUserData?.profile_image : ChatProfile}
          />
        </div>
        <div className={classes.content}>
          {/* <p className={classes.userNameSec}>David thompson</p> */}
          <p>{message}</p>
          {props.created_at && (
            <span className={classes.timestamp}>
              {moment(props.created_at, "YYYY-MM-DD HH:mm:ss").format(
                "hh:mm A"
              )}
            </span>
          )}
        </div>
      </div>
      {!isUser(user) && (
        <div className={`d-flex flex-row ${classes.optionSec}`}>
          <ReadoutSec
            message={message}
            url={read_out_url}
            index={index}
            onResponse={OnReadoutResponse}
          />
          <p
            onClick={() => {
              setPostContent(message);
              setpostModalShow(true);
            }}
          >
            <i className={classes.share_icon}></i> Share
          </p>
        </div>
      )}
    </div>
  );
};

export const ChatVoice = ({ url, audioId, user }) => {
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = new Audio(url);
    audioElement.id = audioId;
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
    <div className={classes.MessageContainer}>
      <div
        className={`${classes.chatbox_message} ${
          isUser(user) ? classes.user_audio_message : ""
        } w-100`}
      >
        <div className={classes.avatar}>
          <img src={ChatProfile} />
        </div>
        <div className={`d-flex flex-column ${classes.playContainer}`}>
          <div className="d-flex flex-row">
            <div className={`${classes.playSec}`}>
              <button onClick={isPlaying ? handlePause : handlePlay}>
                {isPlaying ? (
                  <span class="material-symbols-outlined">pause</span>
                ) : (
                  <span class="material-symbols-outlined">play_arrow</span>
                )}
              </button>
            </div>

            <div className={classes.sliderSec}>
              <input
                type="range"
                min="0"
                max={Math.round(duration)}
                value={Math.round(currentTime)}
                onChange={handleSeek}
                aria-label="Audio Seekbar"
              />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className={classes.controlSec}>
              <div className={classes.timeSec}>
                <span>{formatTime(currentTime)}</span> /{" "}
                <span>
                  {isNaN(parseInt(duration)) ? "-" : formatTime(duration)}
                </span>
              </div>
            </div>
            <span className={`${classes.timestamp} ${classes.timeSec}`}>
              12:34 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatInput = ({ HandleSendMessage, onAudioResult, disabled }) => {
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const [ChatMessage, setChatMessage] = useState("");

  const onRecordStart = () => {
    reset();
  };
  const onRecordStop = (url, blob) => {
    // const file = new File([blob], "RecordAudio.wav", {
    //   type: blob.type,
    // });
    onAudioResult({
      user: 1,
      type: "audio",
      message: url,
    });
  };

  const handleClose = () => {
    pause();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.stop();
      })
      .catch((error) => {});
  };

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      stopStreamsOnStop: true,
      onStart: onRecordStart,
      onStop: onRecordStop,
    });

  const handleAllowMicPermission = () => {
    requestAudioPermissions()
      .then(() => {
        if (status === "idle" || status === "stopped") {
          startRecording();
        } else {
          stopRecording();
        }
      })
      .catch((err) => {
        const { type, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.error("browser does not have permission to access microphone");
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.error("user didn't allow app to access microphone");
        } else {
          toast.error(message);
        }
      });
  };

  const getValidNumber = (num) => {
    return num.toString().length == 1
      ? num.toString().padStart(2, "0")
      : num.toString();
  };

  return status === "idle" || status === "stopped" ? (
    <div className={classes.ContentSec}>
      <InputGroup className={classes.chatinputSec}>
        <Form.Control
          className={classes.inSearch}
          placeholder="Type or ask question here.."
          aria-label="Type or ask question here.."
          value={ChatMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) {
              HandleSendMessage(ChatMessage);
              setChatMessage("");
            }
          }}
          onChange={(e) => {
            setChatMessage(e.target.value);
          }}
        />

        {ChatMessage === "" ? (
          <InputGroup.Text className={classes.searchIcon}>
            <img src={ChatIcon} />
          </InputGroup.Text>
        ) : (
          <InputGroup.Text
            className={classes.searchIcon}
            onClick={() => {
              if (!disabled) {
                HandleSendMessage(ChatMessage);
                setChatMessage("");
              }
            }}
          >
            <span className={`material-symbols-outlined ${classes.SendIcon}`}>
              send
            </span>
          </InputGroup.Text>
        )}
      </InputGroup>

      <i
        className={classes.mic_icon}
        onClick={() => {
          handleAllowMicPermission();
        }}
      />
    </div>
  ) : (
    <div className={classes.recordingBox}>
      <div className={classes.RecordingTimeSec}>
        {" "}
        {getValidNumber(minutes) + `:` + getValidNumber(seconds)}
      </div>
      <div className={classes.ActionSec}>
        <span
          class={`material-symbols-outlined ${classes.closeIcon}`}
          onClick={() => {
            handleClose();
            clearBlobUrl();
          }}
        >
          delete
        </span>
        <InputGroup.Text
          className={classes.searchIcon}
          onClick={() => {
            stopRecording();
            handleClose();
          }}
        >
          <span className={`material-symbols-outlined ${classes.SendIcon}`}>
            send
          </span>
        </InputGroup.Text>
      </div>
    </div>
  );
};
