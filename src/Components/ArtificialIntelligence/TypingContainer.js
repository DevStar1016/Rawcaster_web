import React, { useEffect, useState } from "react";

const TypingContainer = () => {
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
  return <span>Thinking{dots}</span>;
};

export default TypingContainer;
