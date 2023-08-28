import React, { useEffect } from "react";
import EventBox from "./EventBox";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";

const EventRoom = () => {
  const meetingManager = useMeetingManager();

  useEffect(() => {
    meetingManager.subscribeToEventDidReceive((eventname, message) => {
      console.log(eventname, message, "MEETING MANAGER EVENT");
    });
  }, []);
  return (
    <div>
      {/* <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
      >
        <Reactions />
      </div> */}
      <EventBox />
    </div>
  );
};

export default EventRoom;
