/**
 * A modal component that allows users to capture images or record videos using the camera.
 * @param {boolean} visible - Determines whether the modal is visible or not.
 * @param {function} onClose - Callback function to handle closing the modal.
 * @param {function} onSuccess - Callback function to handle successful capture or recording.
 * @param {string} [type="Camera"] - The type of media to capture or record (either "Camera" or "Video").
 * @param {object} videoRef - Reference to the video element.
 * @param {object} canvasRef - Reference to the canvas element.
 * @param {boolean} [isPreviewEnabled=true] - Determines whether the preview modal is enabled or not.
 */
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import classes from "../Modal.module.css";
import PreviewModal from "./PreviewModal";
import { toast } from "react-hot-toast";
import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";
import { useStopwatch } from "react-timer-hook";
import { Spinner } from "react-bootstrap";

const CameraModal = ({
  visible,
  onClose,
  onSuccess,
  type = "Camera",
  videoRef,
  canvasRef,
  isPreviewEnabled = true,
}) => {
  const { seconds, minutes, isRunning, start, pause } = useStopwatch({
    autoStart: false,
  });
  const [PreviewMedia, setPreviewMedia] = useState();
  const [error, setError] = useState(null);

  /**
   * Callback function that is triggered when recording starts.
   * Calls the 'start' function to begin the recording process.
   * @returns None
   */
  const onRecordStart = () => {
    start();
  };

  /**
   * Handles the preview of a file and URL.
   * If preview is enabled, sets the preview media to the provided file and URL.
   * If preview is disabled, calls the onSuccess function with the file, toggles the webcam on, and clears the blob URL.
   * @param {File} file - The file to preview.
   * @param {string} url - The URL to preview.
   * @returns None
   */
  const handlePreview = (file, url) => {
    if (isPreviewEnabled) {
      setPreviewMedia({ file, url });
    } else {
      onSuccess(file);
      handleToggleWebcam(true);
      clearBlobUrl();
    }
  };

  /**
   * Callback function triggered when recording is stopped.
   * @param {string} url - The URL of the recorded video.
   * @param {Blob} blob - The recorded video data as a Blob object.
   * @returns None
   */
  const onRecordStop = (url, blob) => {
    const file = new File([blob], "myVideo.mp4", {
      type: "video/mp4",
    });

    handlePreview(file, url);
    pause();
    handleToggleWebcam(false);
  };

  /**
   * Initializes the useReactMediaRecorder hook with the specified configuration options.
   * @param {boolean} video - Indicates whether to record video or not.
   * @param {boolean} stopStreamsOnStop - Indicates whether to stop media streams when recording stops.
   * @param {Function} onStart - Callback function to be executed when recording starts.
   * @param {Function} onStop - Callback function to be executed when recording stops.
   * @returns An object containing the status of the recording, functions to start and stop recording, and a function to clear the recorded media URL.
   */
  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      video: true,
      stopStreamsOnStop: true,
      onStart: onRecordStart,
      onStop: onRecordStop,
    });

  /**
   * Handles the logic for capturing video only using the user's media devices.
   * Requests permission to access the user's video device with a specified width of 300 pixels.
   * If permission is granted, it starts recording the video.
   * If permission is denied or an error occurs, it logs the error to the console.
   * @returns None
   */
  const handleVideoonly = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(() => {
        startRecording();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  /**
   * Handles the video and audio functionality by requesting media permissions,
   * starting the recording, and handling any errors that occur.
   * @returns None
   */
  const handleVideoandAudio = () => {
    requestMediaPermissions()
      .then(() => {
        startRecording();
      })
      .catch((err) => {
        const { type, message } = err;

        handleVideoonly();
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

  /**
   * Handles the toggling of the webcam on or off.
   * @param {boolean} isClose - Indicates whether the webcam should be closed.
   * @returns None
   */
  const handleToggleWebcam = (isClose) => {
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      } else {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            videoRef.current.srcObject = stream;
          })
          .catch((error) => setError(error));
      }
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(
          (stream) =>
            (videoRef.current = { ...videoRef.current, srcObject: stream })
        )
        .catch((error) => setError(error));
    }
    if (isClose) {
      onClose();
    }
  };

  const handleStartVideo = () => {
    handleVideoandAudio();
  };

  /**
   * Handles an image encoded as a base64 string.
   * @param {string} base64String - The base64 encoded string of the image.
   * @returns None
   */
  const handleImage = (base64String) => {
    var pos = base64String.indexOf(";base64,");
    var type = base64String.substring(5, pos);
    var b64 = base64String.substr(pos + 8);
    var imageContent = atob(b64);
    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);
    for (var n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    var blob = new Blob([buffer], { type: type, name: "captureImg" });
    const file = new File([blob], "testimg", {
      type: type,
    });
    handleToggleWebcam(false);
    handlePreview(file, URL.createObjectURL(file));
  };

  /**
   * Captures an image from a video element and converts it to a data URL.
   * @returns None
   */
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      handleImage(dataURL);
    }
  };

  /**
   * React hook that triggers a function to handle toggling the webcam when the "visible" prop changes.
   * @param {boolean} visible - Indicates whether the webcam is visible or not.
   * @returns None
   */
  useEffect(() => {
    if (visible) {
      handleToggleWebcam(false);
    }
  }, [visible]);
  /**
   * Executes a side effect when the 'error' dependency changes.
   * If there is an error, it displays an error toast message with the error message.
   * @param {Error | null} error - The error object, if any.
   * @returns None
   */
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

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

  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      className="CameraModal"
      onCancel={() => {
        handleToggleWebcam(true);
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
            handleToggleWebcam(false);
          }}
        >
          <PreviewModal
            url={PreviewMedia.file}
            previewurl={PreviewMedia.url}
            onSuccess={(file) => {
              setPreviewMedia();
              setTimeout(() => {
                onSuccess(file);
                handleToggleWebcam(true);
                clearBlobUrl();
              }, 100);
            }}
            onClose={() => {
              setPreviewMedia();
              handleToggleWebcam(false);
            }}
          />
        </Modal>
      )}
      <>
        {visible && (
          <div
            style={{ height: "488px", width: "100%" }}
            className={classes.cameraSec}
          >
            {visible ? (
              <video
                ref={videoRef}
                id="Camera_ref"
                autoPlay
                style={{ height: "100%", width: "100%", borderRadius: "7px" }}
              />
            ) : null}
            {visible ? (
              <canvas ref={canvasRef} style={{ display: "none" }} />
            ) : (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {status === "recording" && (
              <div className={classes.timeSec}>
                {getValidNumber(minutes) + `:` + getValidNumber(seconds)}
              </div>
            )}
            {type === "Camera" && (
              <div className={classes.btnSec}>
                <button onClick={() => captureImage()}>
                  <span className="material-symbols-outlined">
                    photo_camera
                  </span>
                </button>
              </div>
            )}
            {type === "Video" && (
              <div className={classes.btnSec}>
                {status === "recording" ? (
                  <button onClick={stopRecording}>
                    <span
                      className={`material-symbols-outlined ${classes.recIcon}`}
                    >
                      slideshow
                    </span>
                    Stop
                  </button>
                ) : (
                  <button onClick={() => handleStartVideo()}>
                    <span
                      className={`material-symbols-outlined ${classes.recIcon}`}
                    >
                      radio_button_checked
                    </span>
                    Start
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </>
    </Modal>
  );
};

export default CameraModal;
