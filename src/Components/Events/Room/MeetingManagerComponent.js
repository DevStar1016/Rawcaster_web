import { DeviceLabels } from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import React, { useEffect } from "react";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import {
  JoinAttendeeMeeting,
  viewEventsService,
} from "../../../Services/ApiService";
import { useLocation, useNavigate } from "react-router";
import { useMainContext } from "../../../Shared/Context";

const MeetingManagerComponent = () => {
  const location = useLocation();
  const token = useAuthToken();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const event_id = queryParams.get("meeting_id");
  const userData = useAuthData();
  const { meetingManager } = useMainContext();

  const configureMeetingManager = async (meetingId, isHost) => {
    const formData = {
      MeetingId: meetingId,
      userId: userData?.user_id,
    };
    const response = await JoinAttendeeMeeting(formData);
    if (response.data.status === 200) {
      const { Attendee, meeting } = response.data.result;
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        meeting,
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
      } catch (error) {
        console.log(error, "errorData");
      }
    } else {
      console.log(response.data);
    }
  };

  useEffect(() => {
    if (userData && token && meetingManager.meetingStatus === 0) {
      let formData = new FormData();
      formData.append("token", token);
      formData.append("event_id", event_id);
      viewEventsService(formData)
        .then((response) => {
          if (response.data.status === 1) {
            const eventdetails = response.data.event_detail;
            const isHost =
              parseInt(userData?.user_id) ===
              parseInt(eventdetails?.original_user_id);
            configureMeetingManager(eventdetails.chime_meeting_id, isHost);
          } else {
            navigate(-1);
          }
        })
        .catch((error) => {
          navigate(-1);
        });
    }
  }, [event_id, token, userData]);

  return <div></div>;
};

export default MeetingManagerComponent;
