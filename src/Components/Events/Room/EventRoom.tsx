import { useEffect } from "react";
import EventBox from "./EventBox";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { EndAttendeeMeeting } from "../Components/Methods";

const EventRoom = () => {
  const meetingManager = useMeetingManager();

  /**
   * End Meeting Handle By Amazon Chime SDK
   */
  useEffect(() => {
    meetingManager.subscribeToEventDidReceive((eventname, message) => {
      if (eventname === "meetingEnded") {
        const endData = { message: "This meeting has ended !" };
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
