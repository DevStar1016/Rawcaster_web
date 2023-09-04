import { useState } from "react";
import classes from "./Room.module.css";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { Layout } from "antd";
import ChatIcon from "../../../Assets/Icons/svg/chat_icon.svg";
import { Form, InputGroup } from "react-bootstrap";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import EmojiPicker from "../../../UIComponents/EmojiPicker";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { EventContextProp } from "../Components/types";
import { useEventRoomContext } from "../../../Shared/Context";

const { Header, Footer, Content } = Layout;

const CommentBox = () => {
  const {
    EventMessages,
    userdata,
    EventData,
    setEventMessages,
    setisChatorParticipant,
  }: EventContextProp = useEventRoomContext();
  const [isEmoji, setisEmoji] = useState(false);
  const [ChatMessage, setChatMessage] = useState("");

  /**
   *
   *  Send Comment to every attendee in Meeting Room
   */
  const handleSendMessage = (message: string | null) => {
    setEventMessages((pre: any) => [
      {
        ...userdata,
        refId: EventData?.chime_meeting_id,
        message: message ? message : ChatMessage,
        isPrivate: false,
      },
      ...pre,
    ]);
    ChimesendMessage(
      {
        ...userdata,
        refId: EventData?.chime_meeting_id,
        message: message ? message : ChatMessage,
        isPrivate: false,
      },
      CHIME_SOCKET_EVENTS.SEND_MESSAGE_TO_MEETING_ROOM
    );

    setChatMessage("");
    setisEmoji(false);
  };

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
            <p>Comments</p>
          </div>
          <div
            onClick={() => {
              setisChatorParticipant(false);
            }}
          >
            <i className="material-symbols-outlined">cancel</i>
          </div>
        </div>
      </Header>
      <Content>
        <div className={classes.chatBox}>
          {EventMessages?.map((ele) => (
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
              placeholder="Type your Comment here.."
              aria-label="Type your Comment here.."
              value={ChatMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(null);
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
                  handleSendMessage(null);
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
