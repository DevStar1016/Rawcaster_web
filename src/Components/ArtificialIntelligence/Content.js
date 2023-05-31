import React, { useEffect, useRef, useState } from "react";
import classes from "./ArtificialIntelligence.module.css";
import { ChatInput, ChatVoice, MessageContent } from "./Utility";
import { AIChatService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import moment from "moment";
import { useChatBotContext } from "../../Shared/Context";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import ChatProfile from "../../Assets/Icons/svg/chat_r_logo.svg";
import TypingContainer from "./TypingContainer";

const ChatContent = () => {
  const token = useAuthToken();
  const { Messages, setMessages, isChatOpen } = useChatBotContext();
  const [isTyping, setisTyping] = useState(false);
  const [ChatEnabled, setChatEnabled] = useState(true);

  const HandleSendMessage = (ChatMessage = "") => {
    const formData = {
      token,
      user_query: ChatMessage,
    };
    AIChatService(JSONtoformdata(formData))
      .then((res) => {
        setMessages((pre) => [
          {
            user: 2,
            type: "message",
            message: res.data.msg,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          ...pre,
        ]);
      })
      .finally(() => {
        setChatEnabled(true);
        setisTyping(false);
      });
  };

  const ChatType = (ele) => {
    switch (ele.type) {
      case "message":
        return <MessageContent {...ele} />;
      case "audio":
        return <ChatVoice url={ele.message} {...ele} audioId={new Date()} />;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      HandleSendMessage();
    }
  }, [isChatOpen]);

  return (
    <div className={classes.Content}>
      <div className={classes.MessageBox}>
        {isTyping ? (
          <div
            className={`${classes.chatbox_message} ${classes.typingSec} mb-2`}
          >
            <div className={classes.avatar}>
              <img src={ChatProfile} />
            </div>
            <div className={classes.content}>
              <p>
                <TypingContainer />
              </p>
            </div>
          </div>
        ) : null}
        {Messages.map((ele, index) => {
          return <ChatType {...ele} index={index} />;
        })}
      </div>
      <ChatInput
        disabled={!ChatEnabled}
        HandleSendMessage={(ChatMessage) => {
          if (ChatMessage.trim() !== "") {
            setChatEnabled(false);
            setisTyping(true);

            setMessages((pre) => [
              {
                user: 1,
                type: "message",
                message: ChatMessage,
                created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              ...pre,
            ]);
            HandleSendMessage(ChatMessage);
          }
        }}
        onAudioResult={(val) => {
          setMessages((pre) => [val, ...pre]);
        }}
      />
    </div>
  );
};

export default ChatContent;
