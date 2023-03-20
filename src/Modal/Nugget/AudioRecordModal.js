import { Modal } from "antd";
import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";
import { requestAudioPermissions } from "mic-check/lib/requestMediaPermissions";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import AudioRecord from "../../Assets/Images/audio_img.gif";
import AudioStop from "../../Assets/Images/audio_stop.jpg";
import { PostNuggetContext } from "../../Shared/Context";
import { millisecondsToMMSS } from "../../Shared/Utility";
import classes from "../Modal.module.css";
import PreviewModal from "./PreviewModal";

const AudioRecordModal = ({ onClose, visible }) => {
  const { setFileValues } = useContext(PostNuggetContext);
  const [PreviewMedia, setPreviewMedia] = useState();
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
    setPreviewMedia(file);
  };

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStart: onRecordStart,
      onStop: onRecordStop,
    });

  const handleStartMic = () => {
    requestAudioPermissions()
      .then(() => {
        if (status === "idle" || status === "stopped") {
          startRecording();
        } else if (status === "recording") {
          stopRecording();
        }
      })
      .catch((err) => {
        const { type, message } = err;
        console.log(message);
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
      {PreviewMedia && (
        <Modal
          footer={null}
          open={PreviewMedia}
          width={"650px"}
          className="CameraModal"
          onCancel={() => {
            setPreviewMedia();
          }}
        >
          <PreviewModal
            url={PreviewMedia}
            onSuccess={(file) => {
              setPreviewMedia();
              setTimeout(() => {
                setFileValues(file);
                clearBlobUrl();
                onClose();
              }, 100);
            }}
            onClose={() => {
              setPreviewMedia();
            }}
          />
        </Modal>
      )}
      {isRecording && (
        <div
          className={classes.timeSec}
          style={{ color: "#000", marginTop: 10 }}
        >
          {millisecondsToMMSS(TimerValue * 1000)}
        </div>
      )}
      {isRecording ? (
        <img width="100%" src={AudioRecord} className={classes.audioplayIcon} />
      ) : (
        <img width="100%" src={AudioStop} className={classes.audioplayIcon} />
      )}

      <div
        onClick={async () => {
          handleStartMic();
        }}
        className={`${classes.btnSec} mt-4`}
      >
        {isRecording ? (
          <button>
            <span className={`material-symbols-outlined ${classes.recIcon}`}>
              slideshow
            </span>{" "}
            Stop Recording
          </button>
        ) : (
          <button className={classes.recordSec}>
            <span class="material-symbols-outlined">mic</span> Start Recording
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AudioRecordModal;
