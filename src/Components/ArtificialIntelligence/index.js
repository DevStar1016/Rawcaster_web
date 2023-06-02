import React, { useState } from "react";
import Heading from "./Heading";
import ChatContent from "./Content";
import AIIcon from "../../Assets/Icons/svg/AI_icon.svg";
import classes from "./ArtificialIntelligence.module.css";
import { Button, Popover } from "antd";
import { ChatBotContext } from "../../Shared/Context";
import { useAuthData } from "../../Shared/Reduxfetcher";

const ArtificialIntelligence = () => {
  const userData = useAuthData();
  const [isChatOpen, setisChatOpen] = useState(false);
  const [Messages, setMessages] = useState();
  const [audio, setAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(null);

  const generateRandomId = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    console.log("Random ID:", parseInt(randomId));
    return parseInt(randomId);
    // Perform any additional actions with the randomId here
  };

  const values = {
    isChatOpen,
    setisChatOpen,
    Messages,
    setMessages,
    audio,
    setAudio,
    isPlaying,
    setisPlaying,
    generateRandomId,
  };

  return (
    <ChatBotContext.Provider value={values}>
      <Popover
        placement="leftBottom"
        className={classes.ChatBotBtnSec}
        open={isChatOpen}
        overlayClassName={`${classes.overLayClasses} chatbotClass`}
        title={
          <Heading
            onClose={() => {
              setisChatOpen(false);
            }}
          />
        }
        onOpenChange={(val) => {
          setMessages([]);
          setisChatOpen(val);
        }}
        content={ChatContent}
        trigger="click"
      >
        <Button
          className={classes.ChatBotBtn}
          onClick={() => {
            setisChatOpen(!isChatOpen);
          }}
        >
          <img src={AIIcon} />
        </Button>
      </Popover>
    </ChatBotContext.Provider>
  );
};

export default ArtificialIntelligence;
