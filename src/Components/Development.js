import React, { useEffect, useRef, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Alert, Button, notification } from "antd";
import { Toast, ToastContainer } from "react-bootstrap";

// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const Development = () => {
  const [show, setShow] = useState(false);
  const [userId, setuserId] = useState("");
  const [NotificationApi, notificationcontextHolder] =
    notification.useNotification();

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div>
      {notificationcontextHolder}
      <div className="h-100 p-5 mt-5 m-auto w-100">
        <button className="mx-2">Create Channel</button>
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
        <button
          onClick={() => {
            setShow(!show);
          }}
        >
          Get Tags
        </button>
      </div>
      <ToastContainer position="bottom-end" className="eventpopupContainer">
        <Toast onClose={() => setShow(false)} show={show}>
          <Toast.Body
            style={{
              backgroundColor: "transparent",
            }}
          >
            <Alert
              message="Warning Text"
              onClose={() => {
                setShow(false);
              }}
              action={
                <Button type="text" size="small" ghost>
                  Done
                </Button>
              }
              closable
            />
          </Toast.Body>
        </Toast>
      </ToastContainer>
      {/* <Reactions />
      <CommentBox /> */}
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
