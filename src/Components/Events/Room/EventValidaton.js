import React, { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from "react-router";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { useMainContext } from "../../../Shared/Context";
import {
  ExitMeetingService,
  viewEventsService,
} from "../../../Services/ApiService";
import {
  ChimesendMessage,
  ChimesocketListen,
} from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import WaitingRoom from "./WaitingRoom";
import { getusetId } from "../../../Shared/Utility";
import { Button, notification } from "antd";
import {
  useAudioVideo,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { toast } from "react-hot-toast";
import { UserOutlined } from "@ant-design/icons";

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
  const [isFetching, setisFetching] = useState(true);
  const audiovideo = useAudioVideo();
  const [notificationToast, setnotificationToast] = useState({
    show: false,
    msg: null,
    title: null,
    type: null,
    buttons: [],
    icon: null,
  });

  const handleExitMeeting = (userdetails) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append("token", token);
      formData.append("meeting_id", EventData?.chime_meeting_id);
      formData.append("attendeeId", userdetails?.AttendeeId);
      ExitMeetingService(formData)
        .then(() => {
          audiovideo.stop();
          resolve();
        })
        .catch(() => {
          toast.error("Unable to end Meeting !");
          reject();
        });
    });
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
            setEventData(eventdetails);
            ChimesocketListen.connect();
            ChimesendMessage(
              { userId: userData.user_id },
              CHIME_SOCKET_EVENTS.JOIN_SOCKET
            );
            if (
              userData.user_id === getusetId(eventdetails?.original_user_id)
            ) {
              ChimesendMessage(
                { meetingId: eventdetails?.chime_meeting_id },
                CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM
              );
            } else {
              ChimesendMessage(
                { meetingId: eventdetails?.chime_meeting_id },
                CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
              );
            }

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

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING,
      (user_data) => {
        setnotificationToast({
          show: true,
          msg: `${user_data.name} Joined Meeting`,
          title: null,
          buttons: [<Button>View</Button>],
          icon: <UserOutlined />,
        });
        setattendeesList((pre) => [...pre, user_data]);
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING);
    };
  }, [attendeesList]);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.USER_LEFTED_MEETING,
      (user_data) => {
        console.log("userdata", user_data);
        setnotificationToast({
          show: true,
          msg: `${user_data.name} Lefted Meeting`,
          title: null,
          buttons: [<Button>View</Button>],
          icon: <UserOutlined />,
        });

        setattendeesList((pre) =>
          pre.filter((ele) => ele.id !== user_data.userId)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.USER_LEFTED_MEETING);
    };
  }, [attendeesList]);

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
    setisFetching,
    isFetching,
    handleExitMeeting,
    notificationToast,
    setnotificationToast,
  };

  return isWaitingRoom ? (
    <WaitingRoom EventData={EventData} setisWaitingRoom={setisWaitingRoom} />
  ) : (
    <>
      <Outlet context={contectValues} />
    </>
  );
};

export default EventValidaton;
