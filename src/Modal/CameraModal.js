import { Modal } from "antd";
import React, { useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Camera } from "react-camera-pro";
import classes from "./Modal.module.css";
import { loadXHR } from "../Shared/Utility";

const CameraModal = ({ visible, onClose, onSuccess, type = "Camera" }) => {
  const camera = useRef(null);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });

  useEffect(() => {
    if (mediaBlobUrl) {
      handleVideo(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  const handleVideo = async (mediaBlobUrl) => {
    loadXHR(mediaBlobUrl).then(function (blob) {
      const file = new File([blob], "myVideo.mp4", {
        type: "video/mp4",
      });
      onSuccess(file);
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

  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      onCancel={() => {
        onClose();
      }}
    >
      {visible && (
        <div
          style={{ height: "500px", width: "500px" }}
          className={classes.cameraSec}
        >
          <Camera ref={camera} />
          {type === "Camera" && (
            <button onClick={() => handleImage(camera.current.takePhoto())}>
              <span class="material-symbols-outlined">photo_camera</span>
            </button>
          )}
          {type === "Video" && (
            <div>
              {status === "recording" ? (
                <button onClick={stopRecording}>Stop Recording</button>
              ) : (
                <button onClick={startRecording}>Start Recording</button>
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
