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
}) => {
  const { seconds, minutes, isRunning, start, pause } = useStopwatch({
    autoStart: false,
  });
  const [PreviewMedia, setPreviewMedia] = useState();
  const [error, setError] = useState(null);

  const onRecordStart = () => {
    start();
  };

  const onRecordStop = (url, blob) => {
    const file = new File([blob], "myVideo.mp4", {
      type: "video/mp4",
    });
    setPreviewMedia({ file: file, url: url });
    pause();
    handleToggleWebcam(false);
  };

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      video: true,
      stopStreamsOnStop: true,
      onStart: onRecordStart,
      onStop: onRecordStop,
    });

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
    setPreviewMedia({ file: file, url: URL.createObjectURL(file) });
  };

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

  useEffect(() => {
    if (visible) {
      handleToggleWebcam(false);
    }
  }, [visible]);
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

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
