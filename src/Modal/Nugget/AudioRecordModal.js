import { Modal } from "antd";
import { MediaPermissionsErrorType } from "mic-check";
import { requestAudioPermissions } from "mic-check/lib/requestMediaPermissions";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import { useStopwatch } from "react-timer-hook";
import AudioRecord from "../../Assets/Images/audio_img.gif";
import AudioStop from "../../Assets/Images/audio_stop.jpg";
import { PostNuggetContext } from "../../Shared/Context";
import classes from "../Modal.module.css";
import PreviewModal from "./PreviewModal";
import { Timer } from "../../Shared/Utility";

const AudioRecordModal = ({ onClose, visible, onSuccess }) => {
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const [PreviewMedia, setPreviewMedia] = useState();
  const [CloseAudio, setCloseAudio] = useState(false);
  const [previewMediaData, setPreviewMediaData] = useState(null);

  const handleClose = () => {
    pause();
    clearBlobUrl();
    setPreviewMedia();
    setPreviewMediaData(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        clearBlobUrl();
        mediaRecorder.ondataavailable = (event) => {
          // Handle the recorded data chunk here
        };
        stopRecording();
        onClose();
      })
      .catch((error) => {
        stopRecording();
        onClose();
      });
  };

  const onRecordStart = () => {
    reset();
    timerRef.current = new Timer(function () {
      if (recordingRef.current === "recording") {
        stopRecording();
      }
    }, 150000);
  };
  const onRecordStop = (url, blob) => {
    console.log(CloseAudio, "CloseAudioCloseAudio from recorder");
    if (!CloseAudio) {
      const file = new File([blob], "RecordAudio.wav", {
        type: blob.type,
      });
      setPreviewMedia({ file: file, url: url });
      return;
    }
  };

  const {
    status,
    startRecording,
    stopRecording,
    clearBlobUrl,
    pauseRecording,
    resumeRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    stopStreamsOnStop: true,
    onStart: onRecordStart,
    // onStop: onRecordStop,
  });

  useEffect(() => {
    recordingRef.current = status;
  }, [status]);
  useEffect(() => {
    setPreviewMediaData(mediaBlobUrl);
    if (mediaBlobUrl) {
      const audioFile = new File([mediaBlobUrl], "RecordAudio.wav", {
        type: "audio/wav",
      });
      setPreviewMediaData({ file: audioFile, url: mediaBlobUrl });
    }
  }, [mediaBlobUrl]);

  const handleStartMic = () => {
    requestAudioPermissions()
      .then(() => {
        if (status === "idle" || status === "stopped") {
          clearBlobUrl();
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
      timerRef.current?.resume();
      start();
      resumeRecording();
    } else {
      timerRef.current?.pause();
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
        setCloseAudio(true);
        handleClose();
      }}
    >
      {previewMediaData && !CloseAudio && (
        <Modal
          footer={null}
          open={previewMediaData}
          width={"650px"}
          className="CameraModal"
          onCancel={() => {
            setPreviewMedia();
            setPreviewMediaData(null);
          }}
        >
          <PreviewModal
            url={previewMediaData.file}
            modified={Date.now()}
            previewurl={previewMediaData.url}
            onSuccess={(file) => {
              reset();
              pause();
              setPreviewMedia();
              setPreviewMediaData(null);
              const timeout = setTimeout(() => {
                onSuccess(file);
                clearBlobUrl();
                onClose();
                clearTimeout(timeout);
              }, 100);
            }}
            onClose={() => {
              setPreviewMedia();
              setPreviewMediaData(null);
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
        <img
          width="100%"
          src={AudioRecord}
          alt="Record Audio"
          className={classes.audioplayIcon}
        />
      ) : (
        <img
          width="100%"
          src={AudioStop}
          alt="Stop Recording"
          className={classes.audioplayIcon}
        />
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
              onClick={() => {
                setCloseAudio(false);
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
            onClick={() => {
              setCloseAudio(false);
              handleStartMic();
            }}
          >
            <span className="material-symbols-outlined">mic</span> Start
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AudioRecordModal;
