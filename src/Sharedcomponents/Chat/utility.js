import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
} from "mic-check/lib/requestMediaPermissions";
import { toast } from "react-hot-toast";
import { Form, InputGroup } from "react-bootstrap";
import classes from "./Chat.module.css";
import moment from "moment";
import ChatIcon from "../../Assets/Icons/svg/chat_icon.svg";
import ChatProfile from "../../Assets/Icons/svg/chat_r_logo.svg";
import { Image } from "antd";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";

export const ChatInput = ({
  HandleSendMessage,
  onAudioResult,
  disabled,
  fileuploadEnabled = false,
  cameraenabled = false,
}) => {
  const { seconds, minutes, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const [ChatMessage, setChatMessage] = useState("");
  const loginUserData = useAuthData();

  const [isChatContentValid, setisChatContentValid] = useState(true);
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
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      read_out_url: null,
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

  const getNuggetTextLength = () => {
    if (loginUserData) {
      return loginUserData?.nugget_content_length;
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
              placeholder="Type or ask question here..."
              aria-label="Type or ask question here..."
              value={ChatMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disabled) {
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

            {fileuploadEnabled && (
              <i
                className={classes.upload_icon}
                onClick={() => {
                  console.log("upload");
                }}
              />
            )}
            {cameraenabled && (
              <i
                className={classes.camera_icon}
                onClick={() => {
                  console.log("camera");
                }}
              />
            )}

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
      )}
    </>
  );
};

export const MessageContent = (props) => {
  const { message, user, index } = props;

  const loginUserData = useAuthData();

  const isUser = (id) => {
    if (id === 1) {
      return true;
    }
    return false;
  };

  const getURL = () => {
    return {
      path: "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg",
      media_type: "image",
      media_file_type: "jpg",
      media_id: 1,
    };
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
          {!isUser(user) && (
            <p className={classes.userNameSec}>David thompson</p>
          )}
          <p>{message}</p>
          {/* <Image
            className={classes.chatimg}
            preview={{
              mask: false,
            }}
            src={
              "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg"
            }
          /> */}
          <video controls className={classes.chatimg}>
            <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
          </video>

          {props.created_at && (
            <span className={classes.timestamp}>
              {moment(props.created_at, "YYYY-MM-DD HH:mm:ss").format(
                "hh:mm A"
              )}
            </span>
          )}
        </div>
      </div>
      {/* {!isUser(user) && (
        <div
          className={`d-flex flex-row ${classes.optionSec} ${
            !isshareavailble && classes.isSingleOption
          }`}
        >
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
      )} */}
    </div>
  );
};
