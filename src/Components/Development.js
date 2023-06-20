import React, { useEffect, useRef, useState } from "react";
import { Avatar, List, message } from "antd";
import VirtualList from "rc-virtual-list";
import ChatBox from "./Events/Room/ChatBox";
import { RosterAttendee } from "amazon-chime-sdk-component-library-react";
import StickyPopup from "../Modal/StickyPopup/Stickypopup";

// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 400;

const Development = () => {
  const [open, setOpen] = useState(false);
  const [MeetingId, setMeetingId] = useState("");
  const [data, setData] = useState([]);

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
        // message.success(`${body.results.length} more items loaded!`);
      });
  };

  useEffect(() => {
    appendData();
  }, []);

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
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
      <div
        style={{
          background: "#563662",
          height: "100%",
          width: "20%",
          margin: "auto",
        }}
      >
        <button onClick={() => setOpen(true)}>Open</button>
      </div>
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
      <StickyPopup />
      <br />
    </div>
  );
};

export default Development;
