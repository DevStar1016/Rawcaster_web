import React, { useState } from "react";
import classes from "./Room.module.css";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { Dropdown, Layout, Tag } from "antd";
import ChatIcon from "../../../Assets/Icons/svg/chat_icon.svg";
import { Form, InputGroup } from "react-bootstrap";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import EmojiPicker from "../../../UIComponents/EmojiPicker";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { useEventLayout } from "./EventValidaton";
import { DownOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

const ChatBox = () => {
  const { setisChatorParticipant } = useEventLayout();
  const [SelectedMembers, setSelectedMembers] = useState({
    key: 0,
    label: "Everyone",
  });
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const {
    EventMessages,
    userdetails,
    EventData,

    useAttendeesList,
  } = useLayoutContect();
  const { attendees } = useAttendeesList();
  const [isEmoji, setisEmoji] = useState(false);

  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

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

  const getDropdownmembers = () => {
    const filter_current_user = attendees.filter(
      (ele) => parseInt(ele.userId) !== parseInt(userdetails?.userId)
    );
    return filter_current_user.map((ele) => {
      return { key: ele.userId, label: ele.name };
    });
  };

  const handleSendMessage = (message) => {
    if (SelectedMembers.key === 0) {
      ChimesendMessage(
        {
          ...userdetails,
          refId: EventData?.reference_id,
          message: message ? message : ChatMessage,
          from_user_id: userdetails.userId,
          isPrivate: false,
        },
        CHIME_SOCKET_EVENTS.SEND_MESSAGE_TO_MEETING_ROOM
      );
    }

    setChatMessage("");
    setisEmoji(false);
  };

  const handleSendPrivateMessage = (message) => {
    const finduser = attendees.find(
      (ele) => parseInt(ele.userId) === parseInt(SelectedMembers.key)
    );
    if (finduser) {
      ChimesendMessage(
        {
          ...userdetails,
          refId: EventData?.reference_id,
          message: message ? message : ChatMessage,
          isPrivate: true,
          from_user_id: userdetails.userId,
          userId: finduser.userId,
          send_to: finduser,
        },
        CHIME_SOCKET_EVENTS.SEND_MESSAGE_TO_SINGLE_USER
      );
      setChatMessage("");
      setisEmoji(false);
    }
  };
  console.log(EventMessages, "EventMessages");

  return (
    <Layout
      className={`${classes.popupContainer} ${
        EventData?.type === 2 ? classes.talkshowPopup : ""
      }`}
    >
      <Header className={classes.headerStyle}>
        <div className={classes.popupHeader}>
          <div>
            <i className={`${styles.chat_icon} ${styles.icon} mx-2 mt-1`}></i>
            <p>Chat Room</p>
          </div>
          <div>
            <i
              className="material-symbols-outlined"
              onClick={() => {
                setisChatorParticipant(false);
              }}
            >
              cancel
            </i>
          </div>
        </div>
      </Header>
      <Content>
        <div className={classes.chatBox}>
          {EventMessages.map((ele) => (
            <div
              className={`${classes.messageContainer} ${
                ele.from_user_id === getUserData()?.user_id &&
                classes.usermessageContainer
              }`}
            >
              {ele.isPrivate && (
                <span className={classes.privateuser}>
                  To {ele?.send_to?.name}
                </span>
              )}
              <div
                className={`${classes.message} ${
                  ele.from_user_id === getUserData()?.user_id &&
                  classes.usermessage
                }`}
              >
                <img src={defaultprofileImg} />
                <div className={classes.messagesec}>
                  <span>
                    {ele.name + `${ele.isPrivate ? " (Private)" : ""} `}
                  </span>
                  <p> {ele.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Content>
      <Footer className={classes.chatFooterSec}>
        <Dropdown
          menu={{
            items: [{ key: 0, label: "Everyone" }, ...getDropdownmembers()],
            onClick: ({ key }) => {
              const resultValue = [
                { key: 0, label: "Everyone" },
                ...getDropdownmembers(),
              ].find((ele) => parseInt(ele.key) === parseInt(key));
              setSelectedMembers(resultValue);
            },
          }}
        >
          <div onClick={(e) => e.preventDefault()}>
            <div className={classes.memberSec}>
              {SelectedMembers?.label}
              <DownOutlined color="#C4C4C4" />
            </div>
          </div>
        </Dropdown>
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
                  if (SelectedMembers.key === 0) {
                    handleSendMessage();
                  } else {
                    handleSendPrivateMessage();
                  }
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
                  if (SelectedMembers.key === 0) {
                    handleSendMessage();
                  } else {
                    handleSendPrivateMessage();
                  }
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
                  if (SelectedMembers.key === 0) {
                    handleSendMessage(ele.message);
                  } else {
                    handleSendPrivateMessage(ele.message);
                  }
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
