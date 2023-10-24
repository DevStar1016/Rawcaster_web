import {
  useAttendeeStatus,
  useLocalVideo,
  useMeetingManager,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import styles from "./Menu.module.css";
import { message } from "antd";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { EndMeeting, ExitMeeting, validateMeetingLeave } from "./Methods";
import { useEventRoomContext } from "../../../Shared/Context";
import {
  AttendeeUserData,
  ChimeAttendee,
  EventContextProp,
  MeetingSettingProp,
} from "./types";

type MicrophoneComponentProps = {
  ele?: ChimeAttendee | null;
  attendee?: AttendeeUserData | null;
  isHost?: boolean;
  isCoHost?: boolean;
  className?: string;
  isAllowed?: boolean;
  isGlobal?: boolean;
};

type CameraComponentProps = {
  ele?: ChimeAttendee | null;
  attendee?: AttendeeUserData | null;
  isHost?: boolean;
  isCoHost?: boolean;
  className?: string;
  isGlobal?: boolean;
};

type VolumeComponentProps = {
  ele?: ChimeAttendee | null;
  isEnable?: boolean;
  className?: string;
  onClick?: (val?: any) => void;
};

export const MicrophoneComponent = ({
  ele = null,
  attendee = null,
  isHost = false,
  className = "",
  isAllowed = true,
  isGlobal,
  isCoHost
}: MicrophoneComponentProps) => {
  const { EventData, MeetingSettings, setMeetingSettings,setnotificationToast } =
    useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const { muted } = useAttendeeStatus(ele ? ele?.chimeAttendeeId : "");
  const { toggleMute } = useToggleLocalMute();

  /**
   * Retrieves the user data. If the userData object is defined, it is returned.
   * Otherwise, the tempuserData object is returned.
   * @returns The user data object.
   */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  return isGlobal ? (
    <>
      {MeetingSettings?.default_guest_audio === 0 ? (
        <i
          className={`${styles.unmute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            const value = {
              refId: EventData?.reference_id,
              hostId: getUserData()?.user_id,
              status: true,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            setMeetingSettings((pre: MeetingSettingProp) => ({
              ...pre,
              default_guest_audio: 1,
            }));
          }}
        >
          mic_off
        </i>
      ) : (
        <i
          className={`${styles.mute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            const value = {
              refId: EventData?.reference_id,
              hostId: getUserData()?.user_id,
              status: false,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            setMeetingSettings((pre: MeetingSettingProp) => ({
              ...pre,
              default_guest_audio: 0,
            }));
          }}
        >
          mic
        </i>
      )}
    </>
  ) : (
    <>
      {muted ? (
        <i
          className={`${styles.unmute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if ((isHost || isCoHost) && !attendee?.isHost) {

              const value = {
                refId: EventData?.reference_id,
                hostId: getUserData()?.user_id,
                status: true,
                userId: attendee?.userId,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
              setnotificationToast({
                show: true,
                title: 'Unmute Request Sent',
                icon: null,
                buttons: [],
              });
            } else if ((isHost || isCoHost) && userData?.user_id === attendee?.userId) {
              toggleMute();
            }
          }}
        >
          mic_off
        </i>
      ) : (
        <i
          className={`${styles.mute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if ((isHost || isCoHost) && !attendee?.isHost) {
              const value = {
                refId: EventData?.reference_id,
                hostId: getUserData()?.user_id,
                status: false,
                userId: attendee?.userId,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            } else if (userData?.user_id === attendee?.userId && isAllowed) {
              toggleMute();
            }
          }}
        >
          mic
        </i>
      )}
    </>
  );
};

export const LocalMicrophoneComponent = ({
  className = "",
  isAllowed = true,
}) => {
  const { muted, toggleMute } = useToggleLocalMute();
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      {muted ? (
        <i
          className={`${styles.unmute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if (isAllowed) {
              toggleMute();
            } else {
              messageApi.open({
                type: "warning",
                content: "Your mic has been disabled. Please contact the host",
              });
            }
          }}
        ></i>
      ) : (
        <i
          className={`${styles.mute_icon} ${styles.icon} ${className}`}
          onClick={async () => {
            toggleMute();
          }}
        ></i>
      )}
    </>
  );
};

export const CameraComponent = ({
  ele = null,
  attendee = null,
  isHost = false,
  className = "",
  isGlobal,
  isCoHost,
}: CameraComponentProps) => {
  const { EventData, MeetingSettings, setMeetingSettings } =
    useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const { videoEnabled } = useAttendeeStatus(ele ? ele?.chimeAttendeeId : "");

  /* To get Rawcaster user or non Rawcaster User */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  return isGlobal ? (
    <>
      {MeetingSettings?.default_guest_video === 0 ? (
        <i
          className={`${styles.video_off_icon} ${styles.icon} ${className}`}
          onClick={() => {
            const value = {
              refId: EventData?.reference_id,
              hostId: getUserData()?.user_id,
              status: true,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_VIDEO);
            setMeetingSettings((pre: MeetingSettingProp) => ({
              ...pre,
              default_guest_video: 1,
            }));
          }}
        >
          videocam_off
        </i>
      ) : (
        <i
          className={`${styles.video_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if (isGlobal) {
              const value = {
                refId: EventData?.reference_id,
                hostId: getUserData()?.user_id,
                status: false,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_VIDEO);
              setMeetingSettings((pre: MeetingSettingProp) => ({
                ...pre,
                default_guest_video: 0,
              }));
            }
          }}
        >
          videocam
        </i>
      )}
    </>
  ) : (
    <>
      {!videoEnabled ? (
        <i
          className={`${styles.video_off_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if ((isHost || isCoHost) && !attendee?.isHost) {
              const value = {
                refId: EventData?.reference_id,
                hostId: getUserData()?.user_id,
                status: true,
                userId: attendee?.userId,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_VIDEO);
            }
          }}
        >
          videocam_off
        </i>
      ) : (
        <i
          className={`${styles.video_icon} ${styles.icon} ${className}`}
          onClick={() => {
            const value = {
              refId: EventData?.reference_id,
              hostId: getUserData()?.user_id,
              status: false,
              userId: attendee?.userId,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_VIDEO);
          }}
        >
          videocam
        </i>
      )}
    </>
  );
};

export const LocalCameraComponent = ({
  selectedDevice,
  setselectedDevice,
  isAllowed = true,
  className = "",
}) => {
  const videoinput = useVideoInputs();
  const { isVideoEnabled, toggleVideo } = useLocalVideo();
  const [messageApi, contextHolder] = message.useMessage();
  const meetingmanager = useMeetingManager();
  return (
    <>
      {contextHolder}
      {!isVideoEnabled ? (
        <i
          className={`${styles.video_off_icon} ${styles.icon} ${className} ${
            videoinput.devices.length === 0 ? styles.disableIcon : ""
          }`}
          onClick={() => {
            if (isAllowed) {
              toggleVideo();
            } else {
              messageApi.open({
                type: "warning",
                content:
                  "Your video has been disabled. Please contact the host",
              });
            }
          }}
        ></i>
      ) : (
        <i
          className={`${styles.video_icon} ${styles.icon} ${className} ${
            videoinput.devices.length === 0 ? styles.disableIcon : ""
          }`}
          onClick={async () => {
            // if (isAllowed) {
              if (videoinput.devices.length !== 0) {
                if (!selectedDevice) {
                  await meetingmanager.startVideoInputDevice(
                    videoinput.devices[0]
                  );

                  if (setselectedDevice) {
                    setselectedDevice(videoinput.devices[0]);
                  }
                } else {
                  await meetingmanager.startVideoInputDevice(selectedDevice);
                  if (setselectedDevice) {
                    setselectedDevice(selectedDevice);
                  }
                }
                toggleVideo();
              }
            // }
          }}
        ></i>
      )}
    </>
  );
};

export const VolumeStatusComponent = ({
  ele = null,
  isEnable = true,
  className = "",
  onClick = () => {},
}: VolumeComponentProps) => {
  const { muted } = useAttendeeStatus(ele ? ele?.chimeAttendeeId : "");
  return muted ? null : (
    <>
      {!isEnable ? (
        <i
          className={`${styles.volume_off_icon} ${styles.icon} ${className}`}
          onClick={onClick}
        ></i>
      ) : (
        <i
          className={`${styles.volume_icon} ${styles.icon} ${className} `}
          onClick={onClick}
        ></i>
      )}
    </>
  );
};

export const HangupComponent = () => {
  const {
    EventData,
    handleExitMeeting,
    attendeesList,
    handleEndMeeting,
    userdata,
  }: EventContextProp = useEventRoomContext();
  const meetingmanager = useMeetingManager();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();

  /**
   * Retrieves the user data. If the userData variable is defined, it returns the value of userData.
   * Otherwise, it returns the value of tempuserData.
   * @returns The user data.
   */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  /**
   * Retrieves the current attendee from the attendees list based on the user ID.
   * @returns {AttendeeUserData | undefined} The current attendee object if found, otherwise undefined.
   */
  const getCurrentAttendee = () => {
    return attendeesList.find(
      (ele: AttendeeUserData) => ele.userId === getUserData()?.user_id
    );
  };

  /**
   * Handles the end of a meeting. If the current attendee is the host, it calls the EndMeeting function
   * with the necessary parameters. Otherwise, it calls the ExitMeeting function with the necessary parameters.
   * @returns None
   */
  const HandleEndMeeting = () => {
    if (getCurrentAttendee()) {
      const exitMeeting = validateMeetingLeave(userdata, attendeesList)
      if (!exitMeeting) {
        EndMeeting({
          Attendee: getCurrentAttendee(),
          EventData,
          handleEndMeeting,
          meetingmanager,
        });
      } else {
        ExitMeeting({
          Attendee: getCurrentAttendee(),
          EventData,
          handleExitMeeting,
        });
      }
    }
  };
  return (
    <>
      <div
        className={`${styles.iconContainer} ${styles.EndIcon} ${styles.onlyMob}`}
        onClick={() => {
          HandleEndMeeting();
        }}
      >
        <i className={`${styles.hang_up_icon} ${styles.icon}`}></i>
      </div>
      <div
        className={`${styles.Actionsec} ${styles.onlydes}`}
        style={{
          color: "red",
        }}
        onClick={() => {
          HandleEndMeeting();
        }}
      >
        <span
          className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
        >
          logout
        </span>
        Exit
      </div>
    </>
  );
};
