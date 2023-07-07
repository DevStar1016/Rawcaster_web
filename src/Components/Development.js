import React, { useEffect, useRef, useState } from "react";
import { List, QRCode, message } from "antd";
import VirtualList from "rc-virtual-list";
import ChatBox from "./Events/Room/ChatBox";
import { RosterAttendee } from "amazon-chime-sdk-component-library-react";
import StickyPopup from "../Modal/StickyPopup/Stickypopup";
import classes from "./Dev.module.css";
import ChatAudioplayer from "../Sharedcomponents/AudioPlayer/ChatAudioplayer";
import axios from "axios";
import {
  Avatar,
  ChatContainer,
  MainContainer,
  Message,
  MessageList,
  MessageSeparator,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import joeIco from "../Assets/Icons/png/add_friend.png";
import { useAuthData } from "../Shared/Reduxfetcher";
import {
  DecryptStringToObject,
  EncryptObjectToString,
  JSONtoformdata,
  getRawcaserToken,
} from "../Shared/Utility";
import { ChimesocketListen } from "../Services/SocketService";
// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const Development = () => {
  let userData = getRawcaserToken();
  const [MemberId, setMemberId] = useState("");
  const [ChannelId, setChannelId] = useState("");
  const [MeetingId, setMeetingId] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    ChimesocketListen.on("connect", (message) => {
      console.log("Connected to server");
    });
    ChimesocketListen.on("joinSocket", (message) => {
      console.log(message, "from createMeetingRoom");
    });
    ChimesocketListen.on("createMeetingRoom", (message) => {
      console.log(message, "from createMeetingRoom");
    });
    // return () => {
    //   ChimesocketListen.off("call");
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = () => {
    textareaRef.current.style.height = "45px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleSendMessage = () => {
    // Perform the action when the send button is clicked
    console.log("Sending message:", message);
    // Reset the textarea
    textareaRef.current.style.height = "45px";
  };

  const myObject = {
    name: "John Doe",
    age: 30,
    dept: "John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn Doe",
  };
  const secretKey = "mySecretKey";

  const encryptedString = EncryptObjectToString(myObject);
  console.log("Encrypted String:", encryptedString);

  const decryptedObject = DecryptStringToObject(encryptedString);
  console.log("Decrypted Object:", decryptedObject);

  return (
    <div
      style={{
        position: "relative",
        // height: "100vh",
      }}
    >
      {/* <div className="h-100 p-5 mt-5 m-auto w-100">
        <div className={classes.whatsapp_textarea_wrapper}>
          <textarea
            ref={textareaRef}
            className={classes.whatsapp_textarea}
            placeholder="Type a message..."
            // value={message}
            rows="1"
            onChange={handleChange}
          />
          <button className={classes.send_button} onClick={() => {}}>
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div> */}
      {/* <div className="h-100 p-5 mt-5 m-auto w-100">
        <div
          style={{
            height: "500px",
          }}
        >
          <button
            onClick={() => {
              createChannel();
            }}
          >
            Create Channel
          </button>
          <input
            placeholder="Member"
            value={MemberId}
            onChange={(e) => {
              setMemberId(e.target.value);
            }}
          />
          <input
            placeholder="Channel"
            value={ChannelId}
            onChange={(e) => {
              setChannelId(e.target.value);
            }}
          />
          <button
            onClick={() => {
              addmembertoChannel();
            }}
          >
            Add members to Channel
          </button>
          <button
            onClick={() => {
              sendMessageToChannel();
            }}
          >
            List members of Channel
          </button>
        </div>
      </div> */}
      <div className="h-100 p-5 mt-5 m-auto w-100">
        <button
          className="mx-2"
          onClick={() => {
            window.open("/room", "_blank", {
              popup: true,
            });
          }}
        >
          Create Meeting
        </button>
        <input
          className="mx-2"
          placeholder="Enter MeetingId"
          value={MeetingId}
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <button
          className="mx-2"
          onClick={() => {
            window.open(`/room?meetingid=${MeetingId}`, "_blank", {
              popup: true,
            });
          }}
        >
          Join Meeting
        </button>
      </div>
      {/* <div
        style={{
          background: "#563662",
          height: "100%",
          width: "20%",
          margin: "auto",
        }}
      >
        <button onClick={() => setOpen(true)}>Open</button>
      </div> */}
      {/* 
      <div
        style={{
          background: "#563662",
          height: "100%",
          width: "20%",
          margin: "auto",
        }}
      >
        <ChatBox />
      </div> */}
      <ChatAudioplayer url="https://rawcaster.s3.us-west-2.amazonaws.com/chat/attachment_70611688595304.mp3" />
      {/* <StickyPopup /> */}
      <br />
    </div>
  );
};

export default Development;
