import React, { useEffect, useRef, useState } from "react";

const WebCam = ({ status, style }) => {
  const camRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(stream);
      } catch (error) {
        setError(error);
      }
    }
    console.log("test");
    if (!stream) {
      enableStream();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, []);

  const handleToggleWebcam = (status) => {
    console.log("test");
    if (stream && !status) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => setStream(stream))
        .catch((error) => setError(error));
    }
  };

  useEffect(() => {
    handleToggleWebcam(status);
  }, [status]);

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <>
      {stream && (
        <video
          autoPlay
          style={style}
          ref={(video) => (video ? (video.srcObject = stream) : null)}
        />
      )}
    </>
  );
};

export default WebCam;
