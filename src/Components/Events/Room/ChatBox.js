import React, { useState } from "react";
import classes from "./Room.module.css";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { Layout, Tag } from "antd";
import ChatIcon from "../../../Assets/Icons/svg/chat_icon.svg";
import { Form, InputGroup } from "react-bootstrap";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import EmojiPicker from "../../../UIComponents/EmojiPicker";

const { Header, Footer, Content } = Layout;

const ChatBox = () => {
  //   const { setisChatorParticipant } = useEventLayout();
  const [isEmoji, setisEmoji] = useState(false);
  const [messages, setmessages] = useState([
    {
      user_id: 1,
      message: "I commented on Figma, I want to add some fancy icons",
      user_name: "Vasanth",
    },
    {
      user_id: 2,
      message: "I commented on Figma, I want to add some fancy icons",
      user_name: "Vasanth",
    },
  ]);
  const [ChatMessage, setChatMessage] = useState("");
  const initialMessages = [
    { id: 1, message: "Yes" },
    { id: 2, message: "No" },
    { id: 3, message: "Okay" },
    { id: 4, message: "Good" },
    { id: 5, message: "Nice" },
    { id: 6, message: "Hold On" },
    { id: 7, message: "Thanks" },
  ];
  return (
    <Layout className={classes.popupContainer}>
      <Header className={classes.headerStyle}>
        <div className={classes.popupHeader}>
          <div>
            <i className={`${styles.chat_icon} ${styles.icon} mx-2 mt-1`}></i>
            <p>Chat Room</p>
          </div>
          <div>
            <i
              className="material-symbols-outlined"
              //   onClick={() => {
              //     setisChatorParticipant(null);
              //   }}
            >
              cancel
            </i>
          </div>
        </div>
      </Header>
      <Content>
        <div className={classes.chatBox}>
          {/* <ChatBubble
            variant="incoming"
            senderName="Jim Halpert"
            time="9:47 AM"
            css="margin: 1rem;"
            showTail={true}
          >
            I've always been your biggest flan.
          </ChatBubble>
          <ChatBubble
            variant="outgoing"
            senderName="Ryan Howard"
            time="9:45 AM"
            css="margin: 1rem;"
            showTail={true}
          >
            You should have put him in custardy.
          </ChatBubble>
          <ChatBubble
            variant="incoming"
            senderName="Fred Miller"
            css="margin: 1rem;"
            showTail={true}
          >
            This is an outgoing message with attachment
          </ChatBubble> */}
          {messages.map((ele) => (
            <div
              className={`${classes.messageContainer} ${
                ele.user_id === 1 && classes.usermessageContainer
              }`}
            >
              <div
                className={`${classes.message} ${
                  ele.user_id === 1 && classes.usermessage
                }`}
              >
                <img src={defaultprofileImg} />
                <div className={classes.messagesec}>
                  <span>Vasanth</span>
                  <p> {ele.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Content>
      <Footer className={classes.chatFooterSec}>
        <div className={classes.ContentSec}>
          <InputGroup className={classes.chatinputSec}>
            <span
              className="material-symbols-outlined my-auto ms-1"
              onClick={() => {
                setisEmoji(!isEmoji);
              }}
            >
              mood
            </span>
            <Form.Control
              className={classes.inSearch}
              placeholder="Type your message here.."
              aria-label="Type your message here.."
              value={ChatMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setmessages((pre) => [
                    {
                      user_id: 1,
                      message: ChatMessage,
                      user_name: "Vasanth",
                    },
                    ...pre,
                  ]);
                  setChatMessage("");
                  setisEmoji(false);
                }
              }}
              onChange={(e) => {
                setChatMessage(e.target.value);
              }}
            />

            {ChatMessage.trim() === "" ? (
              <InputGroup.Text className={classes.searchIcon}>
                <img src={ChatIcon} />
              </InputGroup.Text>
            ) : (
              <InputGroup.Text
                className={classes.searchIcon}
                onClick={() => {
                  setmessages((pre) => [
                    {
                      user_id: 1,
                      message: ChatMessage,
                      user_name: "Vasanth",
                    },
                    ...pre,
                  ]);
                  setChatMessage("");
                  setisEmoji(false);
                }}
              >
                <span
                  className={`material-symbols-outlined ${classes.SendIcon}`}
                >
                  send
                </span>
              </InputGroup.Text>
            )}
          </InputGroup>
        </div>
        {isEmoji ? (
          <div className={classes.emojiContainer}>
            <EmojiPicker
              emojiButtonColors={["#364157"]}
              emojiButtonRadius="8px"
              skinTonePosition="none"
              previewPosition="none"
              //   onClickOutside={() => {
              //     setisEmoji(!isEmoji);
              //   }}
              categories={[
                "people",
                "nature",
                "foods",
                "activity",
                "places",
                "objects",
                "symbols",
                "flags",
              ]}
              onEmojiSelect={(e) => {
                setChatMessage((pre) => pre.concat(e.native));
              }}
            />
          </div>
        ) : (
          <div className={classes.tagContainer}>
            {initialMessages.map((ele) => (
              <Tag
                className={classes.tag}
                onClick={() => {
                  setmessages((pre) => [
                    {
                      user_id: 1,
                      message: ele.message,
                      user_name: "Vasanth",
                    },
                    ...pre,
                  ]);
                }}
              >
                {ele.message}
              </Tag>
            ))}
          </div>
        )}
      </Footer>
    </Layout>
  );
};

export default ChatBox;
