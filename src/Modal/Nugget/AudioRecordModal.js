import { Modal } from "antd";
import { MediaPermissionsErrorType } from "mic-check";
import { requestAudioPermissions } from "mic-check/lib/requestMediaPermissions";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import { useStopwatch } from "react-timer-hook";
import AudioRecord from "../../Assets/Images/audio_img.gif";
import AudioStop from "../../Assets/Images/audio_stop.jpg";
import { PostNuggetContext } from "../../Shared/Context";
import classes from "../Modal.module.css";
import PreviewModal from "./PreviewModal";

const AudioRecordModal = ({ onClose, visible, onSuccess }) => {
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const [PreviewMedia, setPreviewMedia] = useState();

  const handleClose = () => {
    pause();
    setPreviewMedia();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.stop();
        clearBlobUrl();
      })
      .catch((error) => {});
  };

  const onRecordStart = () => {
    reset();
  };
  const onRecordStop = (url, blob) => {
    const file = new File([blob], "RecordAudio.wav", {
      type: blob.type,
    });
    setPreviewMedia({ file: file, url: url });
  };

  const {
    status,
    startRecording,
    stopRecording,
    clearBlobUrl,
    pauseRecording,
    resumeRecording,
  } = useReactMediaRecorder({
    audio: true,
    stopStreamsOnStop: true,
    onStart: onRecordStart,
    onStop: onRecordStop,
  });

  const handleStartMic = () => {
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

  const handlePause = () => {
    if (status === "paused") {
      start();
      resumeRecording();
    } else {
      pauseRecording();
      pause();
    }
  };

  const getValidNumber = (num) => {
    return num.toString().length == 1
      ? num.toString().padStart(2, "0")
      : num.toString();
  };

  const isValidRecordDisplay = () => {
    if (status === "recording") {
      return true;
    } else if (status === "paused") {
      return true;
    }
    return false;
  };

  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      onCancel={() => {
        handleClose();
        setTimeout(() => {
          onClose();
        }, 1000);
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
            url={PreviewMedia.file}
            previewurl={PreviewMedia.url}
            onSuccess={(file) => {
              reset();
              pause();
              setPreviewMedia();
              setTimeout(() => {
                onSuccess(file);
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
      {isValidRecordDisplay() && (
        <div
          className={classes.timeSec}
          style={{ color: "#000", marginTop: 10 }}
        >
          {getValidNumber(minutes) + `:` + getValidNumber(seconds)}
        </div>
      )}
      {status === "recording" ? (
        <img width="100%" src={AudioRecord} className={classes.audioplayIcon} />
      ) : (
        <img width="100%" src={AudioStop} className={classes.audioplayIcon} />
      )}

      <div className={`${classes.btnSec} mt-4`}>
        {isValidRecordDisplay() ? (
          <div className="d-flex flex-row">
            <button
              onClick={() => {
                handlePause();
              }}
            >
              <span className={`material-symbols-outlined ${classes.recIcon}`}>
                slideshow
              </span>{" "}
              {status === "paused" ? "Resume" : "Pause"}
            </button>
            <button
              onClick={async () => {
                handleStartMic();
              }}
            >
              <span className={`material-symbols-outlined ${classes.recIcon}`}>
                slideshow
              </span>{" "}
              Stop
            </button>
          </div>
        ) : (
          <button
            className={classes.recordSec}
            onClick={async () => {
              handleStartMic();
            }}
          >
            <span class="material-symbols-outlined">mic</span> Start
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AudioRecordModal;
