import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import classes from "./Camera.module.css";
import WebCam from "./Webcam";

let countdownInterval;

const Camera = ({
  onSuccess,
  type = "Camera",
  canvasRef,
  setisenabled,
  enabled,
}) => {
  const [TimerValue, setTimerValue] = useState(0);

  function countdown(seconds) {
    countdownInterval = setInterval(() => {
      setTimerValue(seconds);
      seconds++;
    }, 1000);
  }

  const onRecordStart = () => {
    // const seconds = parseInt(0);
    // countdown(seconds);
  };

  const onRecordStop = (url, blob) => {
    const file = new File([blob], "myVideo.mp4", {
      type: blob.type,
    });
    onSuccess(file);

    // clearInterval(Interval);
    // setTimerValue(0);
  };

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      video: true,
      onStart: onRecordStart,
      onStop: onRecordStop,
    });

  const handleVideoonly = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        startRecording();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleVideoandAudio = () => {
    requestMediaPermissions()
      .then(() => {
        startRecording();
      })
      .catch((err) => {
        const { type, name, message } = err;

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

  const handleStartVideo = () => {
    handleVideoandAudio();
  };

  //   const handleImage = (base64String) => {
  //     var pos = base64String.indexOf(";base64,");
  //     var type = base64String.substring(5, pos);
  //     var b64 = base64String.substr(pos + 8);
  //     var imageContent = atob(b64);
  //     var buffer = new ArrayBuffer(imageContent.length);
  //     var view = new Uint8Array(buffer);
  //     for (var n = 0; n < imageContent.length; n++) {
  //       view[n] = imageContent.charCodeAt(n);
  //     }
  //     var blob = new Blob([buffer], { type: type, name: "captureImg" });
  //     const file = new File([blob], "testimg", {
  //       type: type,
  //     });

  //     onSuccess(file);
  //   };

  //   const captureImage = () => {
  //     const canvas = canvasRef.current;
  //     const video = videoRef.current;
  //     if (canvas && video) {
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
  //       canvas
  //         .getContext("2d")
  //         .drawImage(video, 0, 0, canvas.width, canvas.height);
  //       const dataURL = canvas.toDataURL("image/png");
  //       handleImage(dataURL);
  //     }
  //   };
  console.log("Webcam");
  return enabled ? (
    <></>
  ) : (
    <div style={{ width: "100%" }} className={`${classes.cameraSec}`}>
      <WebCam
        status={enabled}
        style={{ height: "100%", width: "100%", borderRadius: "7px" }}
      />

      {enabled ? <canvas ref={canvasRef} style={{ display: "none" }} /> : null}

      {type === "Video" && (
        <div className={classes.btnSec}>
          {status === "recording" ? (
            <button onClick={stopRecording}>
              <span className={`material-symbols-outlined ${classes.recIcon}`}>
                slideshow
              </span>{" "}
              Stop Recording
            </button>
          ) : (
            <button onClick={() => handleStartVideo()}>
              <span className={`material-symbols-outlined ${classes.recIcon}`}>
                radio_button_checked
              </span>{" "}
              Start Recording
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Camera;
