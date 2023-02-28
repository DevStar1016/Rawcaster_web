import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Camera } from "react-camera-pro";
import classes from "./Modal.module.css";
import { millisecondsToMMSS } from "../Shared/Utility";
import Webcam from "react-webcam";
import { RecordWebcam, useRecordWebcam } from "react-record-webcam";
let streamMedia;

const CameraModal = ({ visible, onClose, onSuccess, type = "Camera" }) => {
  let videoRef = useRef(null);
  const recordWebcam = useRecordWebcam({ frameRate: 60 });
  const [TimerValue, setTimerValue] = useState(0);
  let countdownInterval;

  const handleCloseMedia = () => {
    let stream = videoRef.current.video.srcObject;
    // var options = {
    //   video: true,
    //   audio: false,
    // };
    // navigator.webkitGetUserMedia(
    //   options,
    //   function (stream) {
    //     try {
    //       stream.getTracks().forEach(function (track) {
    //         track.stop();
    //       });
    //       onClose();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    //   function (e) {
    //     console.log("background error : " + e.name);
    //     onClose();
    //   }
    // );
  };

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
    const file = new File([blob], "myVideo.mp4", {
      type: "video/mp4",
    });
    onSuccess(file);
    handleCloseMedia();
    clearInterval(countdownInterval);
    setTimerValue(0);
  };

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    video: true,
    onStart: onRecordStart,
    onStop: onRecordStop,
  });

  const handleStartVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        streamMedia = stream;
        startRecording();
      })
      .catch((err) => {
        console.error("error:", err);
      });
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
    onSuccess(file);
  };

  useEffect(() => {
    if (visible) {
      recordWebcam.open();
    }
  }, [visible]);

  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      className="CameraModal"
      onCancel={() => {
        recordWebcam.close();
        close();
      }}
    >
      {visible && (
        <div
          style={{ height: "500px", width: "100%" }}
          className={classes.cameraSec}
        >
          <video
            ref={recordWebcam.webcamRef}
            autoPlay
            muted
            style={{ height: "500px", width: "100%" }}
          />
          {/* {visible ? <Camera ref={camera} /> : null} */}
          {status === "recording" && (
            <div className={classes.timeSec}>
              {millisecondsToMMSS(TimerValue * 1000)}
            </div>
          )}
          {type === "Camera" && (
            <button
              onClick={() => handleImage(videoRef.current.getScreenshot())}
            >
              <span class="material-symbols-outlined">photo_camera</span>
            </button>
          )}
          {type === "Video" && (
            <div>
              {status === "recording" ? (
                <button onClick={stopRecording}>Stop Recording</button>
              ) : (
                <button onClick={() => handleStartVideo()}>
                  Start Recording
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <div></div>
    </Modal>
  );
};

export default CameraModal;
