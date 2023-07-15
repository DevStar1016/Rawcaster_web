import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { useMainContext } from "../../../Shared/Context";
import { viewEventsService } from "../../../Services/ApiService";

export function useEventLayout() {
  return useOutletContext();
}

const EventValidaton = () => {
  const [EventData, setEventData] = useState(null);
  const [isChatorParticipant, setisChatorParticipant] = useState(null);
  const [isPinEnabled, setisPinEnabled] = useState(false);
  const navigate = useNavigate();
  const { event_id } = useParams();
  const userData = useAuthData();
  const token = useAuthToken();

  // const { setEventData } = useEventLayout();
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
            // const isHost =
            //   parseInt(userData?.user_id) ===
            //   parseInt(eventdetails?.original_user_id);
            // configureMeetingManager(eventdetails.chime_meeting_id, isHost);
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
  };

  return <Outlet context={contectValues} />;
};

export default EventValidaton;
