import React, { useRef, useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { EventRoomContext } from "../../../Shared/Context";
import {
  EndMeetingService,
  ExitMeetingService,
} from "../../../Services/ApiService";
import WaitingRoom from "./WaitingRoom";
import {
  DeviceLabels,
  useAudioVideo,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";
import { toast } from "react-hot-toast";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import MeetingManagerComponent from "./MeetingManagerComponent";
import { defaultVolume } from "../Configure/Constants";

export function useEventLayout() {
  return useOutletContext();
}

const EventValidaton = () => {
  const RequestRef = useRef([]);
  const [EventData, setEventData] = useState(null);
  const [isChatorParticipant, setisChatorParticipant] = useState(null);
  const [isPinEnabled, setisPinEnabled] = useState(false);
  const token = useAuthToken();
  const userData = useAuthData();
  const [userdata, setuserdata] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [isWaitingRoom, setisWaitingRoom] = useState(true);
  const [RequestList, setRequestList] = useState([]);
  const [attendeesList, setattendeesList] = useState([]);
  const [MeetingSettings, setMeetingSettings] = useState(null);
  const meetingManager = useMeetingManager();
  const [EventMessages, setEventMessages] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [RequestStatusMessage, setRequestStatusMessage] = useState(null);
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

  const handleEndMeeting = (userdetails) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append("token", token);
      formData.append("meeting_id", EventData?.chime_meeting_id);
      EndMeetingService(formData)
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
    const updatedDetails = message.AttendeeList.map((ele) => {
      return {
        ...ele,
        volume: defaultVolume,
      };
    });
    const finduserData = updatedDetails.find(
      (ele) => parseInt(ele.userId) === parseInt(userData.user_id)
    );
    if (finduserData) {
      setuserdata(finduserData);
    }
    const meetingSettings = message.meetingSetting;
    setattendeesList(updatedDetails);
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
      meetingManager.start().then((res) => {
        setisWaitingRoom(false);
        setisLoading(false);
      });
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
    setisLoading,
    isLoading,
    RequestStatusMessage,
    setRequestStatusMessage,
    EventMessages,
    setEventMessages,
    userdata,
    setuserdata,
    handleEndMeeting,
  };

  const hasWaitingRoomEnabled = () => {
    return (
      isWaitingRoom &&
      EventData &&
      parseInt(EventData.original_user_id) !== parseInt(userData?.user_id) &&
      EventData.waiting_room
    );
  };

  return (
    <EventRoomContext.Provider value={contectValues}>
      <>
        <MeetingManagerComponent />
        {hasWaitingRoomEnabled() ? (
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
