import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import classes from "./Modal.module.css";
import { millisecondsToMMSS } from "../Shared/Utility";
import PreviewModal from "./PreviewModal";
import { toast } from "react-hot-toast";
import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";

let countdownInterval;

const CameraModal = ({
  visible,
  onClose,
  onSuccess,
  type = "Camera",
  videoRef,
  canvasRef,
}) => {
  const [PreviewMedia, setPreviewMedia] = useState();
  const [TimerValue, setTimerValue] = useState(0);

  function countdown(seconds) {
    countdownInterval = setInterval(() => {
      setTimerValue(seconds);
      seconds++;
    }, 1000);
  }

  const onRecordStart = () => {
    const seconds = parseInt(0);
    countdown(seconds);
  };

  const onRecordStop = (url, blob) => {
    if (videoRef.current.srcObject !== null) {
      const file = new File([blob], "myVideo.mp4", {
        type: "video/mp4",
      });
      setPreviewMedia(file);
    }
    clearInterval(countdownInterval);
    setTimerValue(0);
  };

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      video: true,
      onStart: onRecordStart,
      onStop: onRecordStop,
    });

  const handleCloseMedia = async () => {
    // if (PreviewMedia) {
    //   setPreviewMedia(false);
    //   clearBlobUrl();
    //   return;
    // }

    setTimeout(() => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }

      clearBlobUrl();

      onClose();
    }, 100);
  };

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
    // Promise.all([
    //   navigator.permissions.query({ name: "camera" }),
    //   navigator.permissions.query({ name: "microphone" }),
    // ])
    //   .then((res) => {
    //     let isGranted = res.every((ele) => ele.state === "granted");
    //     let isDenied = res.every((ele) => ele.state === "denied");
    //     if (isGranted || isDenied) {
    //       handleVideoandAudio();
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Got error :", error);
    //   });
  };

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

    setPreviewMedia(file);
    // onSuccess(file);
  };

  async function fetchData() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

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

  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      className="CameraModal"
      onCancel={() => {
        clearInterval(countdownInterval);
        setTimerValue(0);
        handleCloseMedia();
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
              clearInterval(countdownInterval);
              setTimerValue(0);
              setPreviewMedia();
              setTimeout(() => {
                onSuccess(file);
                handleCloseMedia();
                clearBlobUrl();
                onClose();
              }, 100);
            }}
            onClose={() => {
              clearInterval(countdownInterval);
              setTimerValue(0);
              setPreviewMedia();
              fetchData();
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
            ) : null}
            {status === "recording" && (
              <div className={classes.timeSec}>
                {millisecondsToMMSS(TimerValue * 1000)}
              </div>
            )}
            {type === "Camera" && (
              <div className={classes.btnSec}>
                <button onClick={() => captureImage()}>
                  <span class="material-symbols-outlined">photo_camera</span>
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
                    </span>{" "}
                    Stop Recording
                  </button>
                ) : (
                  <button onClick={() => handleStartVideo()}>
                    <span
                      className={`material-symbols-outlined ${classes.recIcon}`}
                    >
                      radio_button_checked
                    </span>{" "}
                    Start Recording
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
