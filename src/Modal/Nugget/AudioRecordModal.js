/**
 * A modal component for recording audio using the device's microphone.
 * @param {function} onClose - Callback function to close the modal.
 * @param {boolean} visible - Flag indicating whether the modal is visible or not.
 * @param {function} onSuccess - Callback function to handle successful recording.
 * @returns A modal component for recording audio.
 */
import { Modal } from "antd";
import { MediaPermissionsErrorType } from "mic-check";
import { requestAudioPermissions } from "mic-check/lib/requestMediaPermissions";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import { useStopwatch } from "react-timer-hook";
import AudioRecord from "../../Assets/Images/audio_img.gif";
import AudioStop from "../../Assets/Images/audio_stop.jpg";
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
  // const [CloseAudio, setCloseAudio] = useState(false);
  // const [previewMediaData, setPreviewMediaData] = useState(null);

  /**
   * Handles the closing of a media preview.
   * - Pauses the media playback.
   * - Clears the blob URL.
   * - Resets the preview media.
   * - Resets the preview media data.
   * - Stops the media recording.
   * - Closes the media preview.
   * @returns None
   */
  const handleClose = () => {
    pause();
    clearBlobUrl();
    setPreviewMedia();
    // setPreviewMediaData(null);
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

  /**
   * Starts the recording process.
   * - Resets any previous recording state.
   * - Sets a timer to automatically stop the recording after 150000 milliseconds (2.5 minutes).
   * - If the recording is already in progress, it stops the recording.
   * @returns None
   */
  const onRecordStart = () => {
    reset();
    timerRef.current = new Timer(function () {
      if (recordingRef.current === "recording") {
        stopRecording();
      }
    }, 150000);
  };

  /**
   * Callback function triggered when recording is stopped.
   * @param {string} url - The URL of the recorded audio.
   * @param {Blob} blob - The recorded audio data as a Blob object.
   * @returns None
   */
  const onRecordStop = (url, blob) => {
    const file = new File([blob], "RecordAudio.wav", {
      type: blob.type,
    });
    setPreviewMedia({ file: file, url: url });
    return;
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
    onStop: onRecordStop,
  });

  useEffect(() => {
    recordingRef.current = status;
  }, [status]);

  /**
   * useEffect hook that sets the preview media data based on the provided media blob URL.
   * If a media blob URL is provided, it creates a new audio file with the blob data and sets
   * the preview media data to include the file and the URL.
   * @param {string} mediaBlobUrl - The URL of the media blob.
   * @returns None
   */
  // useEffect(() => {
  //   setPreviewMediaData(mediaBlobUrl);
  //   if (mediaBlobUrl) {
  //     const audioFile = new File([mediaBlobUrl], "RecordAudio.wav", {
  //       type: "audio/wav",
  //     });
  //     setPreviewMediaData({ file: audioFile, url: mediaBlobUrl });
  //   }
  // }, [mediaBlobUrl]);

  /**
   * Handles the start microphone action.
   * Requests audio permissions and starts or stops recording based on the current status.
   * Displays error messages for different types of media permission errors.
   * @returns None
   */
  const handleStartMic = () => {
    requestAudioPermissions()
      .then(() => {
        if (status === "idle" || status === "stopped") {
          // clearBlobUrl();
          startRecording();
        } else {
          stopRecording();
        }
      })
      .catch((err) => {
        const { type, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.remove("rawcaster");
          toast.error(
            "browser does not have permission to access camera or microphone",
            { id: "rawcaster" }
          );
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.remove("rawcaster");
          toast.error("user didn't allow app to access camera or microphone", {
            id: "rawcaster",
          });
        } else if (
          type === MediaPermissionsErrorType.CouldNotStartVideoSource
        ) {
          toast.remove("rawcaster");
          toast.error(
            "camera is in use by another application (Zoom, Skype) or browser tab (Google Meet, Messenger Video)",
            { id: "rawcaster" }
          );
        } else {
          toast.remove("rawcaster");
          toast.error(message, { id: "rawcaster" });
        }
      });
  };

  /**
   * Handles the pause functionality based on the current status.
   * If the status is "paused", it resumes the timer, starts recording, and resumes the process.
   * If the status is not "paused", it pauses the timer, pauses recording, and pauses the process.
   * @returns None
   */
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

  /**
   * Takes in a number and returns a string representation of the number with leading zero if it is a single digit number.
   * @param {number} num - The number to format.
   * @returns {string} - The formatted number as a string.
   */
  const getValidNumber = (num) => {
    return num.toString().length == 1
      ? num.toString().padStart(2, "0")
      : num.toString();
  };

  /**
   * Checks if the current status is valid for displaying a record.
   * @returns {boolean} - true if the status is "recording" or "paused", false otherwise.
   */
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
        // setCloseAudio(true);
        handleClose();
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
            // setPreviewMediaData(null);
          }}
        >
          <PreviewModal
            url={PreviewMedia.file}
            modified={Date.now()}
            previewurl={PreviewMedia.url}
            onSuccess={(file) => {
              reset();
              pause();
              setPreviewMedia();
              // setPreviewMediaData(null);
              const timeout = setTimeout(() => {
                onSuccess(file);
                clearBlobUrl();
                onClose();
                clearTimeout(timeout);
              }, 100);
            }}
            onClose={() => {
              setPreviewMedia();
              // setPreviewMediaData(null);
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
                // setCloseAudio(false);
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
              // setCloseAudio(false);
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
