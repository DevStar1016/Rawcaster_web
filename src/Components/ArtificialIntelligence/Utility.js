/**
 * This module contains various components related to the chat functionality in the Artificial Intelligence module.
 *
 * @module ArtificialIntelligence
 */
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
import {
  useChatBotContext,
  useGlobalContext,
  useMainContext,
} from "../../Shared/Context";
import { JSONtoformdata, ReadMore, Timer } from "../../Shared/Utility";
import { TextToAudioService } from "../../Services/ApiService";
import axios from "axios";
import ChatAudioplayer from "../../Sharedcomponents/AudioPlayer/ChatAudioplayer";

/**
 * Local user id(Static) for Artifitial intelligence
 * @param {*} id
 * @returns
 */

export const isUser = (id) => {
  if (parseInt(id) === 1) {
    return true;
  }
  return false;
};
let isRequestCancel = false;

/**
 * A component that displays a readout section for audio playback.
 * @param {string} audiourl - The URL of the audio file to play.
 * @param {number} index - The index of the readout section.
 * @param {string} message - The message to convert to audio.
 * @param {function} onResponse - A callback function to handle the response from the audio conversion service.
 * @returns The readout section component.
 */
export const ReadoutSec = ({ audiourl, index, message, onResponse }) => {
  const { player, setplayer, PlayerSource } = useMainContext();
  const { audio, setAudio, isPlaying, setisPlaying } = useChatBotContext();
  const [isFetchingurl, setisFetchingurl] = useState(false);
  const token = useAuthToken();

  const HandlegetNuggetContentAudio = (url) => {
    if (player) {
      player.pause();
    }
    if (audio) {
      audio.pause();
    }
    const audioElement = new Audio(url);
    audioElement.id = index;
    setAudio(audioElement);
    setplayer(audioElement);
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
        setplayer(null);
        audio.pause();
        setisPlaying(null);
      });
      audio.addEventListener("pause", () => {
        setplayer(null);
        setAudio(null);
      });
    }
    return () => {
      if (audio) {
        audio.removeEventListener("ended", function () {
          setplayer(null);
          audio.pause();
          setisPlaying(null);
        });
        audio.addEventListener("pause", () => {
          setplayer(null);
          setAudio(null);
        });
      }
    };
  }, [audio]);

  const convertToAudio = () => {
    if (audiourl) {
      HandlegetNuggetContentAudio(audiourl);
    } else {
      setisFetchingurl(true);
      if (PlayerSource.current) {
        isRequestCancel = true;
        PlayerSource.current.cancel("Request Cancelled");
      }
      if (!PlayerSource.current) {
        PlayerSource.current = axios.CancelToken.source();
      }
      TextToAudioService(
        JSONtoformdata({
          token,
          message,
        }),
        PlayerSource.current.token
      )
        .then((res) => {
          if (res.data.status === 1) {
            onResponse(res.data.url);
            HandlegetNuggetContentAudio(res.data.url);
          } else {
            toast.remove("Error");
            toast.error(res.data.msg, {
              id: "Error",
            });
          }
        })
        .finally(() => {
          PlayerSource.current = null;
          setisFetchingurl(false);
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
      <i className="material-symbols-outlined">mic_off</i>Stop
    </p>
  ) : (
    <>
      {isFetchingurl ? (
        <p className={`mx-2 ${classes.fetchingSec}`}>
          <div className="dot_typing"></div>
        </p>
      ) : (
        <p
          onClick={() => {
            convertToAudio();
          }}
        >
          <i className={classes.read_mic_icon}></i>Read Out
        </p>
      )}
    </>
  );
};

/**
 * A component that renders the content of a message in a chatbox.
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.setpostModalShow - A function to set the visibility of the post modal.
 * @param {Function} props.setPostContent - A function to set the content of the post.
 * @param {string} props.message - The message content.
 * @param {string} props.user - The user who sent the message.
 * @param {number} props.index - The index of the message.
 * @param {string} props.read_out_url - The URL for the readout of the message.
 * @param {Function} props.OnReadout
 */
export const MessageContent = (props) => {
  const token = useAuthToken();
  const { setpostModalShow, setPostContent } = useGlobalContext();
  const [isFetching, setisFetching] = useState(false);
  const {
    message,
    user,
    index,
    read_out_url,
    OnReadoutResponse,
    isshareavailble,
    translated_text = null,
  } = props;
  const { setMessages } = useChatBotContext();

  const loginUserData = useAuthData();

  const GetTranslatedText = () => {
    setisFetching(true);
    const messageData = {
      token,
      message,
      translation_type: 2,
    };
    TextToAudioService(JSONtoformdata(messageData))
      .then((res) => {
        if (res.data.status === 1) {
          setMessages((pre) => {
            let findIndex = pre.findIndex((elem, i) => i === index);
            let updatedData = [...pre];
            if (findIndex !== -1) {
              updatedData[findIndex] = {
                ...updatedData[findIndex],
                translated_text: res.data.translation,
              };
            }
            return updatedData;
          });
        } else {
          toast.remove("rawcaster");
          toast.error(res?.data?.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        setisFetching(false);
      });
  };
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
          <p>{translated_text ? translated_text : message}</p>
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
        <div
          className={`d-flex flex-row ${classes.optionSec} ${
            !isshareavailble && classes.isSingleOption
          }`}
        >
          {isFetching ? (
            <p className={` mx-2  ${classes.translationSec}`}>
              <div className="dot_typing"></div>
            </p>
          ) : (
            <p
              className={translated_text ? classes.activeTranslate : ""}
              onClick={() => {
                if (translated_text) {
                  setMessages((pre) => {
                    let findIndex = pre.findIndex((elem, i) => i === index);
                    let updatedData = [...pre];
                    if (findIndex !== -1) {
                      updatedData[findIndex] = {
                        ...updatedData[findIndex],
                        translated_text: null,
                      };
                    }
                    return updatedData;
                  });
                } else {
                  GetTranslatedText();
                }
              }}
            >
              <i className={`${classes.translate_icon} rtranslate_icon`}></i>
              Translate
            </p>
          )}
          <ReadoutSec
            message={message}
            audiourl={read_out_url}
            index={index}
            onResponse={OnReadoutResponse}
          />
          {isshareavailble && (
            <p
              onClick={() => {
                setPostContent(message);
                setpostModalShow(true);
              }}
            >
              <i className={classes.share_icon}></i> Share
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * A component that represents a chat voice message.
 * @param {string} url - The URL of the audio file.
 * @param {string} audioId - The ID of the audio element.
 * @param {string} user - The user who sent the message.
 * @param {string} created_at - The timestamp of when the message was created.
 * @param {string | null} query - The query associated with the voice message.
 * @returns The chat voice message component.
 */
export const ChatVoice = ({ url, audioId, user, created_at, query = null }) => {
  const { player, setplayer, ...props } = useMainContext();
  const loginUserData = useAuthData();
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
      audio.addEventListener("pause", () => {
        setIsPlaying(false);
        setAudio(null);
        props.setIsPlaying(false);
      });
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
    if (player) {
      player.pause();
      if (props.setIsPlaying) {
        props.setIsPlaying(false);
      }
    }
    if (audio) {
      setplayer(audio);
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
    setplayer(null);
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
        className={`${classes.user_chatbox_message} ${classes.audioContainer}`}
      >
        <div className={`${classes.content} ${classes.audioContent}`}>
          <div className={classes.audioSec}>
            <div className="d-flex flex-row">
              <div className={classes.audioplayer}>
                <ChatAudioplayer
                  textColor={isUser(user) ? "#FFFFFF" : "#000000"}
                  id={audioId}
                  url={url}
                  time={moment(created_at, "YYYY-MM-DD HH:mm:ss").format(
                    "hh:mm A"
                  )}
                />
              </div>

              <div className={classes.audioAvatar}>
                <img
                  src={
                    isUser(user) ? loginUserData?.profile_image : ChatProfile
                  }
                />
              </div>
            </div>
            {query && <div className={classes.queryText}>{query}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * A component that represents a chat input field for sending messages and recording audio.
 * @param {function} HandleSendMessage - A function to handle sending a message.
 * @param {function} onAudioResult - A function to handle the result of recording audio.
 * @param {boolean} disabled - A flag indicating whether the chat input is disabled.
 * @returns The ChatInput component.
 */
export const ChatInput = ({ HandleSendMessage, onAudioResult, disabled }) => {
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const { ChatMessage, setChatMessage } = useChatBotContext();
  const loginUserData = useAuthData();

  const [isChatContentValid, setisChatContentValid] = useState(true);
  const onRecordStart = () => {
    reset();
    timerRef.current = new Timer(function () {
      if (recordingRef.current === "recording") {
        stopRecording();
      }
    }, 120000);
  };

  const onRecordStop = (url, blob) => {
    onAudioResult({
      user: 1,
      type: "audio",
      message: url,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      read_out_url: null,
      file: blob,
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

  useEffect(() => {
    recordingRef.current = status;
  }, [status]);

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
        toast.remove("Error");
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.error("browser does not have permission to access microphone", {
            id: "Error",
          });
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.error("user didn't allow app to access microphone", {
            id: "Error",
          });
        } else {
          toast.error(message, {
            id: "Error",
          });
        }
      });
  };

  const getNuggetTextLength = () => {
    if (loginUserData) {
      return loginUserData?.ai_content_length;
    } else {
      return 0;
    }
  };

  const getValidNumber = (num) => {
    return num.toString().length == 1
      ? num.toString().padStart(2, "0")
      : num.toString();
  };

  return (
    <>
      {!isChatContentValid && (
        <p className="ErrTxt mx-auto text-center mb-1">
          Message Content cannot be longer than {getNuggetTextLength() + " "}
          characters
        </p>
      )}
      {status === "idle" || status === "stopped" ? (
        <div className={classes.ContentSec}>
          <InputGroup className={classes.chatinputSec}>
            <Form.Control
              className={classes.inSearch}
              placeholder="Type or ask question here.."
              aria-label="Type or ask question here.."
              value={ChatMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disabled && isChatContentValid) {
                  setisChatContentValid(true);
                  HandleSendMessage(ChatMessage);
                  setChatMessage("");
                }
              }}
              onChange={(e) => {
                if (e.target.value.length <= getNuggetTextLength()) {
                  setChatMessage(e.target.value);
                  setisChatContentValid(true);
                } else {
                  setChatMessage(
                    e.target.value.slice(0, getNuggetTextLength())
                  );

                  setisChatContentValid(false);
                }
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
                  if (!disabled && isChatContentValid) {
                    setisChatContentValid(true);
                    HandleSendMessage(ChatMessage);
                    setChatMessage("");
                  }
                }}
              >
                <span
                  className={`material-symbols-outlined ${classes.SendIcon}`}
                >
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
              className={`material-symbols-outlined ${classes.closeIcon}`}
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
      )}
    </>
  );
};
