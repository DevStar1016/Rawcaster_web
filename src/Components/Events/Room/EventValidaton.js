import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { useMainContext } from "../../../Shared/Context";
import { viewEventsService } from "../../../Services/ApiService";
import {
  ChimesendMessage,
  ChimesocketListen,
} from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import WaitingRoom from "./WaitingRoom";

export function useEventLayout() {
  return useOutletContext();
}

const EventValidaton = () => {
  const RequestRef = useRef([]);
  const [EventData, setEventData] = useState(null);
  const [isChatorParticipant, setisChatorParticipant] = useState(null);
  const [isPinEnabled, setisPinEnabled] = useState(false);
  const navigate = useNavigate();
  const { event_id } = useParams();
  const userData = useAuthData();
  const token = useAuthToken();
  const [isWaitingRoom, setisWaitingRoom] = useState(true);
  const [RequestList, setRequestList] = useState([]);
  const [attendeesList, setattendeesList] = useState([]);
  const { meetingManager } = useMainContext();

  useEffect(() => {
    if (userData && token && meetingManager.meetingStatus === 0) {
      let formData = new FormData();
      formData.append("token", token);
      formData.append("event_id", event_id);
      viewEventsService(formData)
        .then((response) => {
          if (response.data.status === 1) {
            const eventdetails = response.data.event_detail;
            setEventData(eventdetails);
            ChimesocketListen.connect();
            ChimesendMessage(
              { userId: userData.user_id },
              CHIME_SOCKET_EVENTS.JOIN_SOCKET
            );
            ChimesendMessage(
              {
                userId: userData?.user_id,
                meetingId: eventdetails?.chime_meeting_id,
                user_name: userData?.name,
                user_img: userData?.profile_image,
              },
              CHIME_SOCKET_EVENTS.JOIN_REQUEST
            );
          } else {
            navigate(-1);
          }
        })
        .catch((error) => {
          navigate(-1);
        });
    }
  }, [event_id, token, userData]);

  const contectValues = {
    isPinEnabled,
    setisPinEnabled,
    isChatorParticipant,
    setisChatorParticipant,
    setEventData,
    EventData,
    setisWaitingRoom,
    setRequestList,
    RequestList,
    RequestRef,
    setattendeesList,
    attendeesList,
  };

  return isWaitingRoom ? (
    <WaitingRoom EventData={EventData} setisWaitingRoom={setisWaitingRoom} />
  ) : (
    <Outlet context={contectValues} />
  );
};

export default EventValidaton;
