import React, { useEffect, useState } from "react";
import { Avatar, List, message } from "antd";
import VirtualList from "rc-virtual-list";
// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 400;

const Development = () => {
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
    <>
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
      <List>
        <VirtualList
          data={data}
          height={ContainerHeight}
          itemHeight={47}
          itemKey="email"
          onScroll={onScroll}
        >
          {(item) => (
            <List.Item key={item.email}>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              />
              <div>Content</div>
            </List.Item>
          )}
        </VirtualList>
      </List>
      {/* <div
        style={{
          background: "#563662",
          height: "100%",
          width: "20%",
          margin: "auto",
        }}
      >
        <Participants />
      </div> */}
      {/* <div
        style={{
          background: "#563662",
          height: 300,
        }}
      >
        <div className={classes.Child}>
          <img src={userImg} />
          <p>{"participant"}</p>
          <div className={classes.overlaySec}>
            <div className={classes.actionContainer}>
              <span class="material-symbols-outlined">mic</span>
              <span class="material-symbols-outlined">videocam</span>
              <span class="material-symbols-outlined">push_pin</span>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Development;
