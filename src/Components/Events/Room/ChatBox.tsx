import { useState } from "react";
import classes from "./Room.module.css";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { Dropdown, Layout, Tag } from "antd";
import ChatIcon from "../../../Assets/Icons/svg/chat_icon.svg";
import { Form, InputGroup } from "react-bootstrap";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import EmojiPicker from "../../../UIComponents/EmojiPicker";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { DownOutlined } from "@ant-design/icons";
import { useEventRoomContext } from "../../../Shared/Context";

const { Header, Footer, Content } = Layout;

type SelectedMemberProp = {
  key: number;
  label: string;
};

const ChatBox = () => {
  const {
    setisChatorParticipant,
    EventMessages,
    userdata,
    EventData,
    setEventMessages,
    attendeesList,
  } = useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const [ChatMessage, setChatMessage] = useState("");
  const [isEmoji, setisEmoji] = useState(false);
  const [SelectedMembers, setSelectedMembers] = useState<SelectedMemberProp>({
    key: 0,
    label: "Everyone",
  });
  const initialMessages = [
    { id: 1, message: "Yes" },
    { id: 2, message: "No" },
    { id: 3, message: "Okay" },
    { id: 4, message: "Good" },
    { id: 5, message: "Nice" },
    { id: 6, message: "Hold On" },
    { id: 7, message: "Thanks" },
  ];

  /* To get Rawcaster user or non Rawcaster User */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  /**
   *
   *  List Of all attendees except local user
   */
  const getDropdownmembers = () => {
    const filter_current_user = attendeesList.filter(
      (ele) => ele.userId !== userdata?.userId &&  !ele.kicked
    );
    return filter_current_user.map((ele) => {
      return { key: ele.userId, label: ele.name };
    });
  };

  /**
   *
   *  Send Comment to every attendee in Meeting Room
   */
  const handleSendMessage = (message: any | null) => {
    if (SelectedMembers.key === 0) {
      ChimesendMessage(
        {
          ...userdata,
          refId: EventData?.reference_id,
          message: message ? message : ChatMessage,
          from_user_id: userdata.userId,
          isPrivate: false,
        },
        CHIME_SOCKET_EVENTS.SEND_MESSAGE_TO_MEETING_ROOM
      );
    }

    setChatMessage("");
    setisEmoji(false);
  };

  /**
   *
   *  Send Comment to Single attendee in Meeting Room
   */
  const handleSendPrivateMessage = (message: any | null) => {
    const finduser = attendeesList.find(
      (ele) => ele.userId === SelectedMembers.key
    );
    if (finduser) {
      ChimesendMessage(
        {
          ...userdata,
          refId: EventData?.reference_id,
          message: message ? message : ChatMessage,
          isPrivate: true,
          from_user_id: userdata.userId,
          userId: finduser.userId,
          send_to: finduser,
        },
        CHIME_SOCKET_EVENTS.SEND_MESSAGE_TO_SINGLE_USER
      );
      // set private msg to sender state
      setEventMessages((pre) => [
        {
          message:ChatMessage,
          name: userdata.name,
          from_user_id: userdata.userId,
          send_to: finduser,
          isPrivate: true,
          refId: EventData?.reference_id,
        },
        ...pre,
      ]);
      setChatMessage("");
      setisEmoji(false);
    }
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
              ].find((ele) => ele.key === parseInt(key));
              if (resultValue) {
                setSelectedMembers(resultValue);
              }
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
                    handleSendMessage(null);
                  } else {
                    handleSendPrivateMessage(null);
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
                    handleSendMessage(null);
                  } else {
                    handleSendPrivateMessage(null);
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
