import { Modal } from "antd";
import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import AudioRecord from "../Assets/Images/audio_img.gif";
import AudioStop from "../Assets/Images/audio_stop.jpg";
import { PostNuggetContext } from "../Shared/Context";
import { millisecondsToMMSS } from "../Shared/Utility";
import classes from "./Modal.module.css";

const AudioRecordModal = ({ onClose, visible }) => {
  const { setFileValues } = useContext(PostNuggetContext);
  const [TimerValue, setTimerValue] = useState(0);
  const [isRecording, setisRecording] = useState(false);
  let countdownInterval;

  function countdown(seconds) {
    countdownInterval = setInterval(() => {
      setTimerValue(seconds);
      seconds++;
    }, 1000);
  }

  const onRecordStart = () => {
    setisRecording(true);
    const seconds = parseInt(0);
    countdown(seconds);
  };
  const onRecordStop = (url, blob) => {
    setisRecording(false);
    clearInterval(countdownInterval);
    setTimerValue(0);
    const file = new File([blob], "RecordAudio.wav", {
      type: "audio/wav",
    });
    console.log(file);
    setFileValues(file);
    onClose();
  };

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStart: onRecordStart,
    onStop: onRecordStop,
  });

  const handleStartMic = () => {
    requestMediaPermissions()
      .then(() => {
        if (status === "idle" || status === "stopped") {
          startRecording();
        } else if (status === "recording") {
          stopRecording();
        }
      })
      .catch((err) => {
        const { type, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.error(
            "browser does not have permission to access camera or microphone"
          );
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.error("user didn't allow app to access camera or microphone");
        } else if (
          type === MediaPermissionsErrorType.CouldNotStartVideoSource
        ) {
          toast.error(
            "camera is in use by another application (Zoom, Skype) or browser tab (Google Meet, Messenger Video)"
          );
        } else {
          toast.error(message);
        }
      });
  };

  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      onCancel={() => {
        onClose();
      }}
    >
      {isRecording && <div>{millisecondsToMMSS(TimerValue * 1000)}</div>}
      {isRecording ? <img src={AudioRecord} /> : <img src={AudioStop} />}

      <div
        onClick={async () => {
          handleStartMic();
        }}
        className={classes.RecordBtn}
      >
        {isRecording ? (
          <span class="material-symbols-outlined">stop_circle</span>
        ) : (
          <span class="material-symbols-outlined">play_circle</span>
        )}
      </div>
    </Modal>
  );
};

export default AudioRecordModal;
