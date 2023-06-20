import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import ChatContent from "./Content";
import AIIcon from "../../Assets/Icons/svg/AI_icon.svg";
import classes from "./ArtificialIntelligence.module.css";
import { Button, Drawer, Popover } from "antd";
import { ChatBotContext } from "../../Shared/Context";
import { detectMob } from "../../Shared/Utility";
import { useLocation } from "react-router";

const ArtificialIntelligence = () => {
  const { pathname } = useLocation();
  const [ChatMessage, setChatMessage] = useState("");
  const [isChatOpen, setisChatOpen] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(null);
  console.log(Messages);

  const generateRandomId = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
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
    ChatMessage,
    setChatMessage,
  };

  useEffect(() => {
    setMessages([]);
  }, [pathname]);

  return (
    <ChatBotContext.Provider value={values}>
      <Drawer
        title={
          <Heading
            onClose={() => {
              setisPlaying(false);
              setChatMessage("");
              setisChatOpen(false);
              if (audio) {
                audio.pause();
              }
            }}
          />
        }
        closable={false}
        placement={"bottom"}
        className="ai_chat"
        width={500}
        height="90%"
        onClose={() => {
          setisPlaying(false);
          setChatMessage("");
          setisChatOpen(false);
          if (audio) {
            audio.pause();
          }
        }}
        open={isChatOpen && detectMob()}
      >
        <ChatContent />
      </Drawer>
      <Popover
        placement="leftBottom"
        className={classes.ChatBotBtnSec}
        open={isChatOpen && !detectMob()}
        overlayClassName={`${classes.overLayClasses} chatbotClass`}
        title={
          <Heading
            onClose={() => {
              setisPlaying(false);
              setChatMessage("");
              setisChatOpen(false);
              if (audio) {
                audio.pause();
              }
            }}
          />
        }
        onOpenChange={(val) => {
          setisChatOpen(val);
          setisPlaying(false);
          if (audio) {
            audio.pause();
          }
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
          <img height="35px" src={AIIcon} />
        </Button>
      </Popover>
    </ChatBotContext.Provider>
  );
};

export default ArtificialIntelligence;
