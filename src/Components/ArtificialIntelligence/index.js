/**
 * A React component that represents an Artificial Intelligence chatbot.
 * @returns The rendered chatbot component.
 */
import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import ChatContent from "./Content";
import AIIcon from "../../Assets/Icons/svg/AI_icon.svg";
import classes from "./ArtificialIntelligence.module.css";
import { Button, Drawer, Popover } from "antd";
import { ChatBotContext, useMainContext } from "../../Shared/Context";
import { detectMob } from "../../Shared/Utility";
import { useLocation } from "react-router";
import { useAuthData } from "../../Shared/Reduxfetcher";
import LoginModal from "../../Modal/Verification/LoginModal";

const ArtificialIntelligence = () => {
  const { pathname } = useLocation();
  const loginUserData = useAuthData();
  const [ChatMessage, setChatMessage] = useState("");
  const [isAudioToTextConvert, setisAudioToTextConvert] = useState(false);
  const [isChatOpen, setisChatOpen] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(null);
  const [getPremiumModal, setgetPremiumModal] = useState(false);

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
    setisAudioToTextConvert,
    isAudioToTextConvert,
  };

  useEffect(() => {
    setMessages([]);
  }, [pathname]);

  const handlePremiumModalClose = () => setgetPremiumModal(false);

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
        // height="90%"
        height="unset"
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
        content={() => {
          return isChatOpen && <ChatContent />;
        }}
        trigger=""
      >
        <Button
          className={classes.ChatBotBtn}
          onClick={() => {
            if (loginUserData && loginUserData.user_status_id >= 3) {
              setisChatOpen(!isChatOpen);
            } else {
              setgetPremiumModal((pre) => !pre);
            }
          }}
        >
          <img height="35px" src={AIIcon} />
        </Button>
      </Popover>
      {getPremiumModal && (
        <LoginModal
          open={getPremiumModal}
          close={handlePremiumModalClose}
          AIclose={true}
          AIopen="Get Premium"
          AImessgae="To access this feature become a premium member!"
          isAI={true}
        />
      )}
    </ChatBotContext.Provider>
  );
};

export default ArtificialIntelligence;
