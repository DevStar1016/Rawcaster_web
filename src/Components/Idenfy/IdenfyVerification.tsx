import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function IdenfyVerification() {
  const { state } = useLocation();
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight);
  useEffect(() => {
    // Update the iframe height whenever the window is resized
    const handleResize = () => {
      setIframeHeight(window.innerHeight);
    };
    // Add a resize event listener
    window.addEventListener("resize", handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <iframe
      id="iframe"
      width="100%"
      height={iframeHeight}
      src={state.url}
      allow="camera"
    />
  );
}
