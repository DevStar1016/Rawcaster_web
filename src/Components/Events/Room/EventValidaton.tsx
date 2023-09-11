import { useRef, useState } from "react";
import { Outlet } from "react-router";
import {
  useAuthData,
  useAuthToken,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
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
import {
  AttendeeUserData,
  MeetingJoinedDataProp,
  MeetingSettingProp,
} from "../Components/types";

const EventValidaton = () => {
  const token = useAuthToken();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const audiovideo = useAudioVideo();
  const RequestRef = useRef([]);
  const [EventData, setEventData] = useState<any>(null);
  const [isChatorParticipant, setisChatorParticipant] = useState(null);
  const [isReactions, setisReactions] = useState(false);
  const [isPinEnabled, setisPinEnabled] = useState<string | number | null>(
    null
  );
  const [isPresentScreen, setisPresentScreen] = useState(false);
  const [isEndLoading, setisEndLoading] = useState<string | null>(null);
  const [userdata, setuserdata] = useState<AttendeeUserData | null>(null);
  const [isLoading, setisLoading] = useState(true);
  const [isWaitingRoom, setisWaitingRoom] = useState(true);
  const [attendeesList, setattendeesList] = useState<AttendeeUserData[]>([]);
  const [MeetingSettings, setMeetingSettings] =
    useState<MeetingSettingProp | null>(null);
  const meetingManager = useMeetingManager();
  const [EventMessages, setEventMessages] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [RequestStatusMessage, setRequestStatusMessage] = useState(null);
  const [notificationToast, setnotificationToast] = useState({
    show: false,
    msg: null,
    title: null,
    type: null,
    buttons: [],
    icon: null,
  });

  /* To get Rawcaster user or non Rawcaster User */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  /**
   *  Attendee and Host Leave the meeting
   */

  const handleExitMeeting = (userdetails: any) => {
    setisEndLoading("Leaving Please Wait ..");
    return new Promise<void>((resolve, reject) => {
      let formData = new FormData();
      if (token) {
        formData.append("token", token);
      }

      formData.append("meeting_id", EventData?.chime_meeting_id);
      formData.append("attendeeId", userdetails?.AttendeeId);
      ExitMeetingService(formData)
        .then(() => {
          audiovideo?.stop();
          resolve();
        })
        .catch(() => {
          toast.remove("rawcaster");
          toast.error("Unable to end Meeting !", { id: "rawcaster" });
          reject();
        })
        .finally(() => {
          setisEndLoading(null);
        });
    });
  };

  /**
   *  Host The meeting
   */
  const handleEndMeeting = () => {
    setisEndLoading("Please Wait Meeting Has Been Ended ..");
    return new Promise<void>((resolve, reject) => {
      let formData = new FormData();
      if (token) {
        formData.append("token", token);
      }

      formData.append("meeting_id", EventData?.chime_meeting_id);
      EndMeetingService(formData)
        .then(() => {
          audiovideo?.stop();
          resolve();
        })
        .catch(() => {
          toast.remove("rawcaster");
          toast.error("Unable to end Meeting !", { id: "rawcaster" });
          setisEndLoading(null);
          reject();
        });
    });
  };

  /**
   *  Join meeting Handling in Amazon Chime SDK
   */

  const handleJoinMeeting = async (message: MeetingJoinedDataProp) => {
    const { Attendee, meeting }: any = message.joinInfo.result;
    const finduserData = message.AttendeeList.find(
      (ele: AttendeeUserData) => ele.userId === getUserData()?.user_id
    );
    if (finduserData) {
      setuserdata(finduserData);
    }
    const meetingSettings = message.meetingSetting;

    if (meetingSettings.pin_enabled === 1) {
      setisPinEnabled(meetingSettings.pinned_user_id);
    }

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
      meetingManager.start().then((res) => {
        setisWaitingRoom(false);
        setisLoading(false);
      });
    } catch (error) {
      toast.remove("rawcaster");
      toast.error("Unable to Connect The Meeting", { id: "rawcaster" });
    }
  };

  /**
   * Context values for Entire EventRoom and Talkshow
   */
  const contextValues = {
    isPinEnabled,
    setisPinEnabled,
    isChatorParticipant,
    setisChatorParticipant,
    setEventData,
    EventData,
    setisWaitingRoom,
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
    isReactions,
    setisReactions,
    isEndLoading,
    setisEndLoading,
    isPresentScreen,
    setisPresentScreen,
  };

  const hasWaitingRoomEnabled = () => {
    return (
      isWaitingRoom &&
      EventData &&
      parseInt(EventData.original_user_id) !== getUserData()?.user_id &&
      EventData?.waiting_room
    );
  };

  return (
    <EventRoomContext.Provider value={contextValues}>
      <>
        <MeetingManagerComponent />
        {hasWaitingRoomEnabled() ? (
          <WaitingRoom />
        ) : (
          <>
            <Outlet />
          </>
        )}
      </>
    </EventRoomContext.Provider>
  );
};

export default EventValidaton;
