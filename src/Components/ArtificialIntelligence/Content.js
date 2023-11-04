import React, { useEffect, useState } from "react";
import classes from "./ArtificialIntelligence.module.css";
import { ChatVoice, MessageContent } from "./Utility";
import { AIChatService } from "../../Services/ApiService";
import { JSONtoformdata, filterValidObject } from "../../Shared/Utility";
import moment from "moment";
import { useChatBotContext } from "../../Shared/Context";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import ChatProfile from "../../Assets/Icons/svg/chat_r_logo.svg";
import TypingContainer from "./TypingContainer";
import { ChatInput } from "../../Sharedcomponents/Chat/utility";

const ChatContent = () => {
  const token = useAuthToken();
  const {
    Messages,
    setMessages,
    isChatOpen,
    audio,
    setisPlaying,
    setisAudioToTextConvert,
  } = useChatBotContext();

  const [isTyping, setisTyping] = useState(false);
  const [ChatEnabled, setChatEnabled] = useState(true);
  const [PlaceHolderText, setPlaceHolderText] = useState(
    "Type your message Here ..."
  );

  /**
   * Handles sending a chat message and audio file to the AI chat service.
   * @param {string} ChatMessage - The chat message to send.
   * @param {File | null} audio_file - The audio file to send (optional).
   * @returns None
   */
  const HandleSendMessage = (ChatMessage = "", audio_file = null) => {
    const formData = {
      token,
      user_query: ChatMessage,
      audio_file,
    };
    AIChatService(JSONtoformdata(filterValidObject(formData)))
      .then((res) => {
        if (audio) {
          audio.pause();
          setisPlaying(false);
        }

        setMessages((pre) => {
          let tempData = [...pre];
          if (res.data.query) {
            tempData[0] = {
              ...tempData[0],
              query: res.data.query,
            };
          } else {
            tempData[0] = {
              ...tempData[0],
              query: ChatMessage,
            };
          }

          return tempData;
        });

        if (audio_file) {
          setMessages((pre) => {
            let tempData = [...pre];
            if (res.data.query) {
              tempData[0] = {
                ...tempData[0],
                query: res.data.query,
              };
            } else {
              tempData[0] = {
                ...tempData[0],
                query: null,
              };
            }

            return tempData;
          });
        }
        if (ChatMessage !== "") {
          setTimeout(() => {
            setMessages((pre) => {
              return [
                {
                  user: 2,
                  type: "message",
                  message: res.data.msg,
                  created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  isshareavailble: ChatMessage !== "",
                  read_out_url: null,
                },
                ...pre,
              ];
            });
          }, 1000);
        } else {
          setPlaceHolderText(res.data.msg);
        }
      })
      .finally(() => {
        setisAudioToTextConvert(false);
        setChatEnabled(true);
        setisTyping(false);
      });
  };

  /**
   * Determines the type of chat element and returns the corresponding component.
   * @param {object} ele - The chat element object.
   * @returns The corresponding component based on the type of chat element.
   */
  const ChatType = (ele) => {
    switch (ele.type) {
      case "message":
        return (
          <MessageContent
            {...ele}
            OnReadoutResponse={(url) => {
              setMessages((pre) => {
                let tempData = [...pre];
                tempData[ele.index] = {
                  ...tempData[ele.index],
                  read_out_url: url,
                };
                return tempData;
              });
            }}
          />
        );
      case "audio":
        return <ChatVoice url={ele.message} {...ele} audioId={new Date()} />;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isChatOpen && Messages.length === 0) {
      HandleSendMessage();
    }
  }, [isChatOpen]);

  /**
   * Extracts the filename from a given URL.
   * @param {string} url - The URL from which to extract the filename.
   * @returns {string} The filename extracted from the URL.
   */
  function getFilenameFromUrl(url) {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    return filename;
  }

  /**
   * Converts a Blob URL to a File object.
   * @param {string} blobUrl - The Blob URL to convert.
   * @returns {Promise<File>} - A Promise that resolves to a File object.
   */
  async function blobUrlToFile(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    try {
      const filename = getFilenameFromUrl(blobUrl); // Replace with your own function to extract the filename from the URL

      return new File([blob], filename);
    } catch (error) {
      return new File([blob], "blobtofile.mp3");
    }
  }

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
      {isChatOpen && (
        <ChatInput
          disabled={!ChatEnabled}
          placeholderValue={PlaceHolderText}
          chatTextMaxLength={100}
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
                  read_out_url: null,
                  isshareavailble: false,
                },
                ...pre,
              ]);
              HandleSendMessage(ChatMessage);
            }
          }}
          onAudioResult={async (val) => {
            setisAudioToTextConvert(true);
            setMessages((pre) => [
              {
                ...val,
                read_out_url: null,
                isshareavailble: false,
                query: "Converting Audio to Text...",
              },
              ...pre,
            ]);
            const file = await blobUrlToFile(val.message);
            HandleSendMessage(null, file);
          }}
        />
      )}
    </div>
  );
};

export default ChatContent;
