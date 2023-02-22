import { Modal } from "antd";
import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder";
import AudioRecord from "../Assets/Images/audio_img.gif";
import AudioStop from "../Assets/Images/audio_stop.jpg";

const AudioRecordModal = ({ onClose, visible }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, askPermissionOnMount: true });
  const [isRecording, setisRecording] = useState(false);
  console.log(status);

  const handleStartMic = () => {
    requestMediaPermissions()
      .then(() => {
        // can successfully access camera and microphone streams
        // DO SOMETHING HERE
      })
      .catch((err) => {
        const { type, name, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          // browser does not have permission to access camera or microphone
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          // user didn't allow app to access camera or microphone
        } else if (
          type === MediaPermissionsErrorType.CouldNotStartVideoSource
        ) {
          // camera is in use by another application (Zoom, Skype) or browser tab (Google Meet, Messenger Video)
          // (mostly Windows specific problem)
        } else {
          // not all error types are handled by this library
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
      {isRecording ? <img src={AudioRecord} /> : <img src={AudioStop} />}

      <div
        onClick={async () => {
          if (status === "idle") {
            await navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                startRecording();
                setisRecording(true);
              })
              .catch((err) => {
                console.log(err.message);
                toast.error(err.message);
              });
          } else if (status === "recording") {
            try {
              setisRecording(false);
              stopRecording();
            } catch (error) {
              console.log(error);
            }
          }
        }}
      >
        {isRecording ? "Stop" : "Start"}
      </div>
    </Modal>
  );
};

export default AudioRecordModal;
