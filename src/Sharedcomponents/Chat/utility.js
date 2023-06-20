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
                className={classes.mic_icon}
                onClick={() => {
                  handleAllowMicPermission();
                }}
              />
            )}
            {cameraenabled && (
              <i
                className={classes.mic_icon}
                onClick={() => {
                  handleAllowMicPermission();
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
