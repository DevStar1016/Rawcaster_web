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

  const values = {
    isChatOpen,
    setisChatOpen,
    Messages,
    setMessages,
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
