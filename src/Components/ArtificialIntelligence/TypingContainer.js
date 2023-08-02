import React, { useEffect, useState } from "react";

const TypingContainer = ({ text = "Thinking" }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "...") {
          return "";
        } else {
          return prevDots + ".";
        }
      });
    }, 500); // Adjust the duration between each dot change as needed

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      {text}
      {dots}
    </>
  );
};

export default TypingContainer;
