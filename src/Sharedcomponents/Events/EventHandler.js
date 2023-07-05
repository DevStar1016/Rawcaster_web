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
    const formData = {
      MeetingId: meetingId,
      userId: userData?.user_id,
    };
    const response = await JoinAttendeeMeeting(formData);
    if (response.data.status === 200) {
      const { Attendee } = response.data.result;
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        {
          meetingId,
        },
        Attendee
      );
      if (isHost) {
        ChimesendMessage(
          { meetingId: meetingId, hostId: userData.user_id },
          CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM
        );
      } else {
        ChimesendMessage(
          { meetingId: meetingId },
          CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
        );
      }

      const meetingOptions = {
        deviceLabels: DeviceLabels.AudioAndVideo,
      };
      try {
        await meetingManager.join(meetingSessionConfiguration, meetingOptions);
        await meetingManager.start();
        window.open("/room", "_blank", {
          popup: true,
        });
      } catch (error) {
        console.log(error, "errorData");
      }
    } else {
      console.log(response.data);
    }
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
