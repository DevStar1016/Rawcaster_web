import { DeviceLabels } from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import React, { useEffect } from "react";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import {
  ChimesendMessage,
  ChimesocketListen,
} from "../../../Services/SocketService";
import { JoinAttendeeMeeting } from "../../../Services/ApiService";
import { useNavigate } from "react-router";
import { useMainContext } from "../../../Shared/Context";
import { JSONtoformdata } from "../../../Shared/Utility";
import { useLayoutContect } from "../../../Layouts/EventLayout";

const MeetingManagerComponent = () => {
  const { EventData } = useLayoutContect();
  const token = useAuthToken();
  const navigate = useNavigate();
  const userData = useAuthData();
  const { meetingManager } = useMainContext();

  const configureMeetingManager = async (meeting_id, isHost) => {
    const attendeeinput = {
      meeting_id,
      token,
    };
    JoinAttendeeMeeting(JSONtoformdata(attendeeinput))
      .then(async (response) => {
        if (response.data.status === 1) {
          const { attendee, meeting } = response.data;
          const meetingSessionConfiguration = new MeetingSessionConfiguration(
            meeting,
            attendee
          );
          if (isHost) {
            ChimesendMessage(
              { meetingId: meeting_id, hostId: userData.user_id },
              CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM
            );
          } else {
            ChimesendMessage(
              { meetingId: meeting_id },
              CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
            );
          }
          const meetingOptions = {
            deviceLabels: DeviceLabels.AudioAndVideo,
          };
          try {
            await meetingManager.join(
              meetingSessionConfiguration,
              meetingOptions
            );
            await meetingManager.start();
          } catch (error) {
            console.log(error, "errorData");
          }
        } else {
          navigate(-1);
        }
      })
      .catch((err) => {
        navigate(-1);
      });
  };

  useEffect(() => {
    if (EventData) {
      const isHost =
        parseInt(userData?.user_id) === parseInt(EventData?.original_user_id);
      configureMeetingManager(EventData.chime_meeting_id, isHost);
    }
  }, [EventData]);

  return <div></div>;
};

export default MeetingManagerComponent;
