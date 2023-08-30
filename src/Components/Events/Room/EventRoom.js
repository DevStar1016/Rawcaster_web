import React, { useEffect } from "react";
import EventBox from "./EventBox";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { EndAttendeeMeeting } from "../Components/Methods";

const EventRoom = () => {
  const meetingManager = useMeetingManager();

  useEffect(() => {
    meetingManager.subscribeToEventDidReceive((eventname, message) => {
      if (eventname === "meetingEnded") {
        const endData = { message: "Meeting Has Been Ended !" };
        EndAttendeeMeeting(endData);
      }
    });
  }, []);
  return (
    <div>
      <EventBox />
    </div>
  );
};

export default EventRoom;
