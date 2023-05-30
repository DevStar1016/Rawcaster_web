import React, { useEffect, useRef, useState } from "react";
import classes from "./ArtificialIntelligence.module.css";
import { ChatInput, ChatVoice, MessageContent } from "./Utility";
import { AIChatService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import moment from "moment";
import { useChatBotContext, useGlobalContext } from "../../Shared/Context";
import { useAuthToken } from "../../Shared/Reduxfetcher";

const ChatContent = () => {
  const token = useAuthToken();
  const { Messages, setMessages, isChatOpen } = useChatBotContext();
  const lastElementRef = useRef(null);

  const HandleSendMessage = (ChatMessage = "") => {
    const formData = {
      token,
      user_query: ChatMessage,
    };
    AIChatService(JSONtoformdata(formData)).then((res) => {
      setMessages((pre) => [
        ...pre,
        {
          user: 2,
          type: "message",
          message: res.data.msg,
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
    });
  };

  useEffect(() => {
    if (lastElementRef && Messages.length) {
      const newElement = lastElementRef?.current;
      newElement.scrollIntoView({ behavior: "smooth", block: "end" });
      newElement.focus();
    }
  }, [Messages]);

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
        {Messages.map((ele, index) => {
          return (
            <div ref={index === Messages.length - 1 ? lastElementRef : null}>
              <ChatType {...ele} index={index} />
            </div>
          );
        })}
      </div>
      <ChatInput
        HandleSendMessage={(ChatMessage) => {
          if (ChatMessage.trim() !== "") {
            setMessages((pre) => [
              ...pre,
              {
                user: 1,
                type: "message",
                message: ChatMessage,
                created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            ]);
            HandleSendMessage(ChatMessage);
          }
        }}
        onAudioResult={(val) => {
          setMessages((pre) => [...pre, val]);
        }}
      />
    </div>
  );
};

export default ChatContent;
