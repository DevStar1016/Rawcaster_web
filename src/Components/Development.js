import React, { useEffect, useRef, useState } from "react";
import classes from "./Dev.module.css";
import styled, { keyframes } from "styled-components";

const Development = () => {
  const keyPressAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

  // Define the styled components for the keyboard and key
  const KeyboardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
  `;

  const Key = styled.button`
    padding: 10px;
    margin: 5px;
    animation: ${keyPressAnimation} 0.5s;

    &:hover {
      background-color: lightgray;
    }

    @media (max-width: 768px) {
      padding: 8px;
      margin: 4px;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      padding: 6px;
      margin: 3px;
      font-size: 12px;
    }
  `;

  const handleKeyPress = (key) => {
    console.log(`Pressed key: ${key}`);
  };

  return (
    <div className="h-100 pt-5 mt-5 m-auto w-25">
      <KeyboardWrapper>
        <Key onClick={() => handleKeyPress("A")}>A</Key>
        <Key onClick={() => handleKeyPress("B")}>B</Key>
        <Key onClick={() => handleKeyPress("C")}>C</Key>
        {/* Add more keys as needed */}
      </KeyboardWrapper>
    </div>
  );
};

export default Development;
