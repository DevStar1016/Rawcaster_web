import { useState, useEffect } from "react";
import Camera from "../Sharedcomponents/Camera";

const Development = () => {
  const [isCameraon, setisCameraon] = useState(true);
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
    enableStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, []);

  const handleToggleWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => setStream(stream))
        .catch((error) => setError(error));
    }
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100 pt-5 mt-5">
      <div>
        {stream && (
          <video
            autoPlay
            style={{ width: "100%", maxWidth: "500px" }}
            ref={(video) => (video ? (video.srcObject = stream) : null)}
          />
        )}
        <button onClick={handleToggleWebcam}>
          {stream ? "Turn off webcam" : "Turn on webcam"}
        </button>
      </div>
      <button
        onClick={() => {
          setisCameraon(!isCameraon);
        }}
      >
        {isCameraon ? "Disable" : "Enable"}
      </button>
    </div>
  );
};

export default Development;
