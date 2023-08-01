import React, { useEffect, useRef, useState } from "react";
import {
  DeviceLabels,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { AddmemberToChannel } from "../Services/Messaging/MessageAPIList";
// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const Development = () => {
  const [userId, setuserId] = useState("");

  const addMember = () => {
    const addMemberValue = {
      ChannelArn:
        "arn:aws:chime:us-east-1:562114208112:app-instance/6ea8908f-999b-4b3d-9fae-fa1153129087/channel/9d951b24-8638-4f6c-85f4-778839ee3d0a",
      Member: {
        Arn: "arn:aws:chime:us-east-1:562114208112:app-instance/6ea8908f-999b-4b3d-9fae-fa1153129087/user/anon_55677030-75e3-4d87-ac51-265b4549562b",
        Name: "Tester",
      },
    };
    AddmemberToChannel(addMemberValue).then((res) => {
      console.log("test", res);
    });
  };

  return (
    <div>
      <div className="h-100 p-5 mt-5 m-auto w-100">
        <button
          className="mx-2"
          onClick={() => {
            addMember();
          }}
        >
          Create Channel
        </button>
        <input
          className="mx-2"
          placeholder="Enter MeetingId"
          value={userId}
          onChange={(e) => {
            setuserId(e.target.value);
          }}
        />
        <button
          className="mx-2"
          onClick={() => {
            // window.open(`/room?meetingid=${MeetingId}`, "_blank", {
            //   popup: true,
            // });
          }}
        >
          Join Meeting
        </button>
        <button>Get Tags</button>
      </div>
    </div>
    // <div
    //   style={{
    //     position: "relative",
    //     // height: "100vh",
    //   }}
    // >
    //   <div className="h-100 p-5 mt-5 m-auto w-100">
    //     <button className="mx-2" onClick={() => {}}>
    //       Create Meeting
    //     </button>
    //     <input
    //       className="mx-2"
    //       placeholder="Enter MeetingId"
    //       value={MeetingId}
    //       onChange={(e) => {
    //         setMeetingId(e.target.value);
    //       }}
    //     />
    //     <button
    //       className="mx-2"
    //       onClick={() => {
    //         // window.open(`/room?meetingid=${MeetingId}`, "_blank", {
    //         //   popup: true,
    //         // });
    //       }}
    //     >
    //       Join Meeting
    //     </button>
    //     <button>Get Tags</button>
    //   </div>

    //   <br />
    // </div>
  );
};

export default Development;
