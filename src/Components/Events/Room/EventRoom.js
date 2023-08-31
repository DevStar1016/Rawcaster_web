import React, { useEffect } from "react";
import EventBox from "./EventBox";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { EndAttendeeMeeting } from "../Components/Methods";

const EventRoom = () => {
  const meetingManager = useMeetingManager();

  const HandleAttendeePresence = (attendeeId, present, externalUserId) => {
    if (!attendeeId.includes("#content") && !present) {
      console.log(externalUserId);
    }
  };

  useEffect(() => {
    meetingManager.subscribeToEventDidReceive((eventname, message) => {
      if (eventname === "meetingEnded") {
        const endData = { message: "Meeting Has Been Ended !" };
        EndAttendeeMeeting(endData);
      }
    });
    meetingManager.audioVideo?.realtimeSubscribeToAttendeeIdPresence(
      HandleAttendeePresence
    );
  }, []);
  return (
    <div>
      <EventBox />
    </div>
  );
};

export default EventRoom;
