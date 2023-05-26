import React, { useEffect, useRef } from "react";

const Development = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  let audioContext;
  let analyser;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Get audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create analyser
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Connect audio source
    const audioElement = audioRef.current;
    const audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(analyser);
    audioSource.connect(audioContext.destination);

    // Render audio visualizer
    const renderFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      // Calculate bar width and spacing
      const barWidth = canvas.width / bufferLength;
      const barSpacing = 2;

      // Draw bars
      dataArray.forEach((value, index) => {
        const barHeight = (value / 255) * canvas.height;
        const x = index * (barWidth + barSpacing);
        const y = canvas.height - barHeight;

        ctx.fillStyle = `rgb(${value}, 0, 0)`;
        ctx.fillRect(x, y, barWidth, barHeight);
      });

      // Call next frame
      requestAnimationFrame(renderFrame);
    };

    // Start rendering frames
    renderFrame();

    return () => {
      // Clean up resources
      analyser.disconnect();
      audioContext.close();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={400} />
      <audio ref={audioRef} controls>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
      </audio>
      {/* <canvas ref={canvasRef} width={800} height={400} />
      <audio
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        controls
      /> */}
    </div>
    // <audio
    //   ref={audioRef}
    //   src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    //   controls
    // />
  );
};

export default Development;
