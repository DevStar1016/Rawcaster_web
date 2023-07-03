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
import { JSONtoformdata, getRawcaserToken } from "../Shared/Utility";
import { ChimesocketListen } from "../Services/SocketService";
// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const Development = () => {
  let userData = getRawcaserToken();
  const [MemberId, setMemberId] = useState("");
  const [ChannelId, setChannelId] = useState("");
  const [MeetingId, setMeetingId] = useState("");
  const textareaRef = useRef(null);
  // useEffect(() => {

  //   axios
  //     .post("192.168.1.246:4500/chime/create-channel", formdata)
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // }, []);

  useEffect(() => {
    ChimesocketListen.on("connect", (message) => {
      console.log(message, "message.event");
      // ...
    });
    ChimesocketListen.on("ping", (message) => {
      console.log(message, "message.event");
    });

    ChimesocketListen.on("error", (error) => {
      console.log(error, "message.event");
    });

    ChimesocketListen.on("reconnect", (attempt) => {
      console.log(attempt, "message.event");
    });

    ChimesocketListen.on("reconnect_attempt", (attempt) => {
      console.log(attempt, "message.event");
    });

    return () => {
      ChimesocketListen.off("call");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createChannel = () => {
    const data = {
      group_name: "test",
      chime_bearer: userData.chat_user_id,
    };
    axios
      .post(
        "http://192.168.1.108:8003/rawcaster/create_channel",
        JSONtoformdata(data)
      )
      .then((res) => {
        console.log(res.data, "res.data.ChannelArn");
        setChannelId(res.data.ChannelArn);
      });
  };

  const addmembertoChannel = () => {
    const data = {
      channel_arn: ChannelId,
      chime_bearer: userData.chat_user_id,
      member_id: JSON.stringify([MemberId]),
    };
    axios
      .post(
        "http://192.168.1.108:8003/rawcaster/addmembers",
        JSONtoformdata(data)
      )
      .then((res) => {
        console.log(res.data, "res.data.ChannelArn");
      });
  };

  const sendMessageToChannel = () => {
    const data = {
      channel_arn: ChannelId,
      chime_bearer: userData.chat_user_id,
      message: "message",
    };
    axios
      .post(
        "http://192.168.1.108:8003/rawcaster/send_message",
        JSONtoformdata(data)
      )
      .then((res) => {
        console.log(res.data);
      });
  };

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

  return (
    <div
      style={{
        position: "relative",
        // height: "100vh",
      }}
    >
      <div className="h-100 p-5 mt-5 m-auto w-100">
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
      </div>
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
      </div>
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
      </div> */}
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
      <ChatAudioplayer />
      {/* <StickyPopup /> */}
      <br />
    </div>
  );
};

export default Development;
