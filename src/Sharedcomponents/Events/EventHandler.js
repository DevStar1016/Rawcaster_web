import React from "react";
import classes from "./Event.module.css";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { ChimesendMessage } from "../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { JoinAttendeeMeeting } from "../../Services/ApiService";
import {
  DeviceLabels,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";

const EventHandler = ({ title, isHost, meetingId }) => {
  const userData = useAuthData();
  const meetingManager = useMeetingManager();

  const handleJoinEvent = async (e) => {
    e.stopPropagation();
    window.open(`/room?meeting_id=${meetingId}`, "_blank", {
      popup: true,
    });
  };
  return (
    <div
      className={classes.link}
      onClick={(e) => {
        handleJoinEvent(e);
      }}
    >
      {isHost ? `Start ${title}` : `Join ${title}`}
      <span class="material-symbols-outlined">arrow_right_alt</span>
    </div>
  );
};

export default EventHandler;
