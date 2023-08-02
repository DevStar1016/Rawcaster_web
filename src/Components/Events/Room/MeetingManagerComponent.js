import React, { useEffect } from "react";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesocketListen } from "../../../Services/SocketService";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import { getAttendeesFromMeetingService } from "../../../Services/ApiService";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../../Shared/Utility";

const MeetingManagerComponent = () => {
  const token = useAuthToken();
  const {
    setRequestList,
    RequestRef,
    setattendeesList,
    attendeesList,
    EventData,
    setisFetching,
  } = useLayoutContect();

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
      (user_data) => {
        RequestRef.current.push(user_data);
        setRequestList((pre) => [...pre, user_data]);
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER);
    };
  }, []);

  const getAttendees = () => {
    const userData = {
      token,
      meeting_id: EventData?.chime_meeting_id,
    };
    getAttendeesFromMeetingService(JSONtoformdata(userData))
      .then((res) => {
        if (res.data.status === 1) {
          const mergedArray = res.data.data.Attendees.reduce((acc, item) => {
            const matchingItem = res.data.data.users.find(
              (el) => parseInt(el.id) === parseInt(item.ExternalUserId)
            );
            if (matchingItem) {
              acc.push({ ...item, ...matchingItem });
            }
            return acc;
          }, []);
          setattendeesList(mergedArray);
        } else {
          setattendeesList([]);
        }
      })
      .finally(() => {
        setisFetching(false);
      });
  };

  useEffect(() => {
    if (token && EventData?.chime_meeting_id) {
      getAttendees();
    }
  }, [EventData, token]);

  return <div></div>;
};

export default MeetingManagerComponent;
