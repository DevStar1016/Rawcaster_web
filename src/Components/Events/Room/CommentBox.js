import React, { useState } from "react";
import classes from "./Room.module.css";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { Dropdown, Layout, Tag } from "antd";
import ChatIcon from "../../../Assets/Icons/svg/chat_icon.svg";
import { Form, InputGroup } from "react-bootstrap";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import EmojiPicker from "../../../UIComponents/EmojiPicker";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { useEventLayout } from "./EventValidaton";
import { DownOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const { Header, Footer, Content } = Layout;

const CommentBox = () => {
  const [isEmoji, setisEmoji] = useState(false);
  const [ChatMessage, setChatMessage] = useState("");
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    console.log(commentList, "ChatMessageChatMessage");
  }, [commentList]);
  return (
    <Layout className={classes.popupContainer}>
      <Header className={classes.headerStyle}>
        <div style={{ background: "#563662" }} className={classes.popupHeader}>
          <div>
            <i className={`${styles.chat_icon} ${styles.icon} mx-2 mt-1`}></i>
            <p>Comment Box</p>
          </div>
          <div>
            <i className="material-symbols-outlined">cancel</i>
          </div>
        </div>
      </Header>
      <Content style={{ background: "#563662" }}>
        <div className={classes.chatBox}>
          {commentList?.map((ele) => (
            <div className={`${classes.messageContainer}`}>
              <div className={`${classes.message}`}>
                <img src={defaultprofileImg} />
                <div className={classes.messagesec}>
                  <span>
                    {ele?.name + `${ele?.isPrivate ? " (Private)" : ""} `}
                  </span>
                  <p> {ele?.message}</p>
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
                  // if (SelectedMembers.key === 0) {
                  //   handleSendMessage();
                  // } else {
                  //   handleSendPrivateMessage();
                  // }
                  setCommentList((pre) => [
                    { message: ChatMessage, name: "demo", isPrivate: false },
                    ...pre,
                  ]);
                  setChatMessage("");
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
                  //   if (SelectedMembers.key === 0) {
                  //     handleSendMessage();
                  //   } else {
                  //     handleSendPrivateMessage();
                  //   }

                  setCommentList((pre) => [
                    { message: ChatMessage, name: "demo", isPrivate: false },
                    ...pre,
                  ]);
                  setChatMessage("");
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
        {isEmoji && (
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
        )}
      </Footer>
    </Layout>
  );
};

export default CommentBox;
