import {
  useAttendeeStatus,
  useAudioVideo,
  useLocalVideo,
  useMeetingManager,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import styles from "./Menu.module.css";
import { message } from "antd";
import { useEventLayout } from "../Room/EventValidaton";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { EndMeeting, ExitMeeting } from "./Methods";
import { useEventRoomContext } from "../../../Shared/Context";

export const MicrophoneComponent = ({
  ele,
  attendee,
  isHost,
  className = "",
  isAllowed = true,
  isGlobal,
}) => {
  const { EventData, MeetingSettings, setMeetingSettings } =
    useEventRoomContext();
  const userData = useAuthData();
  const { muted } = useAttendeeStatus(ele?.chimeAttendeeId);
  const { toggleMute } = useToggleLocalMute();

  return isGlobal ? (
    <>
      {MeetingSettings?.default_guest_audio === 0 ? (
        <i
          className={`${styles.unmute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            const value = {
              refId: EventData?.reference_id,
              hostId: userData?.user_id,
              status: true,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            setMeetingSettings((pre: any) => ({
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
              hostId: userData?.user_id,
              status: false,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            setMeetingSettings((pre: any) => ({
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
            if (isHost && !attendee.isHost) {
              const value = {
                refId: EventData?.reference_id,
                hostId: userData?.user_id,
                status: true,
                userId: attendee.userId,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            } else if (attendee.user_id === attendee.userId) {
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
            if (isHost && !attendee.isHost) {
              const value = {
                refId: EventData?.reference_id,
                hostId: userData?.user_id,
                status: false,
                userId: attendee.userId,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_AUDIO);
            } else if (attendee.user_id === attendee.userId && isAllowed) {
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
      )}
    </>
  );
};

export const CameraComponent = ({
  ele,
  attendee,
  isHost,
  className = "",
  isGlobal,
}) => {
  const { EventData, MeetingSettings, setMeetingSettings } =
    useEventRoomContext();
  const userData = useAuthData();
  const { videoEnabled } = useAttendeeStatus(ele?.chimeAttendeeId);
  return isGlobal ? (
    <>
      {MeetingSettings?.default_guest_video === 0 ? (
        <i
          className={`${styles.video_off_icon} ${styles.icon} ${className}`}
          onClick={() => {
            const value = {
              refId: EventData?.reference_id,
              hostId: userData?.user_id,
              status: true,
            };
            ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_VIDEO);
            setMeetingSettings((pre: any) => ({
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
                hostId: userData?.user_id,
                status: false,
              };
              ChimesendMessage(value, CHIME_SOCKET_EVENTS.ENABLE_VIDEO);
              setMeetingSettings((pre: any) => ({
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
            if (isHost && !attendee.isHost) {
              const value = {
                refId: EventData?.reference_id,
                hostId: userData?.user_id,
                status: true,
                userId: attendee.userId,
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
              hostId: userData?.user_id,
              status: false,
              userId: attendee.userId,
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
  const audiovideo = useAudioVideo();
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
            if (isAllowed) {
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
            }
          }}
        ></i>
      )}
    </>
  );
};

export const VolumeStatusComponent = ({
  ele,
  isEnable = true,
  className,
  onClick,
}) => {
  const { muted } = useAttendeeStatus(ele?.chimeAttendeeId);
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
  const { EventData, handleExitMeeting, attendeesList }: any = useEventLayout();
  const userData = useAuthData();

  const getCurrentAttendee = () => {
    return attendeesList.find(
      (ele: any) => parseInt(ele.userId) === parseInt(userData.user_id)
    );
  };

  const HandleEndMeeting = () => {
    if (getCurrentAttendee()?.isHost) {
      EndMeeting({
        Attendee: getCurrentAttendee(),
        EventData,
        handleExitMeeting,
      });
    } else {
      ExitMeeting({
        Attendee: getCurrentAttendee(),
        EventData,
        handleExitMeeting,
      });
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
