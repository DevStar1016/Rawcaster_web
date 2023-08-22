import React, { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from "react-router";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { EventRoomContext, useMainContext } from "../../../Shared/Context";
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
  DeviceLabels,
  useAudioVideo,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { toast } from "react-hot-toast";
import { UserOutlined } from "@ant-design/icons";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import MeetingManagerComponent from "./MeetingManagerComponent";

export function useEventLayout() {
  return useOutletContext();
}

const EventValidaton = () => {
  const RequestRef = useRef([]);
  const [EventData, setEventData] = useState(null);
  const [isChatorParticipant, setisChatorParticipant] = useState(null);
  const [isPinEnabled, setisPinEnabled] = useState(false);
  const token = useAuthToken();

  const [isWaitingRoom, setisWaitingRoom] = useState(true);
  const [RequestList, setRequestList] = useState([]);
  const [attendeesList, setattendeesList] = useState([]);
  const [MeetingSettings, setMeetingSettings] = useState(null);
  const { meetingManager } = useMainContext();
  const [isFetching, setisFetching] = useState(false);
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

  const handleJoinMeeting = async (message) => {
    const { Attendee, meeting } = message.joinInfo.result;
    setattendeesList(message.AttendeeList);
    setMeetingSettings(message.meetingSetting);
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      meeting,
      Attendee
    );
    const meetingOptions = {
      deviceLabels: DeviceLabels.AudioAndVideo,
    };
    try {
      await meetingManager.join(meetingSessionConfiguration, meetingOptions);
      await meetingManager.start();
      setisWaitingRoom(false);
    } catch (error) {
      toast.error("Unable to Connect The Meeting");
    }
  };

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
    handleJoinMeeting,
    MeetingSettings,
    setMeetingSettings,
  };

  return (
    <EventRoomContext.Provider value={contectValues}>
      <>
        <MeetingManagerComponent />
        {isWaitingRoom ? (
          <WaitingRoom
            EventData={EventData}
            setisWaitingRoom={setisWaitingRoom}
            context={contectValues}
          />
        ) : (
          <>
            <Outlet context={contectValues} />
          </>
        )}
      </>
    </EventRoomContext.Provider>
  );
};

export default EventValidaton;
