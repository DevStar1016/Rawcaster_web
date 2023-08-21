import {
  useAttendeeStatus,
  useAudioVideo,
  useLocalVideo,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import styles from "./Menu.module.css";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { useEventLayout } from "../Room/EventValidaton";
import { toast } from "react-hot-toast";

export const MicrophoneComponent = ({
  ele,
  attendee,
  isHost,
  className = "",
}) => {
  const { muted } = useAttendeeStatus(ele?.chimeAttendeeId);
  const { toggleMute } = useToggleLocalMute();
  return (
    <>
      {muted ? (
        <i
          className={`${styles.unmute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if (isHost && !attendee.isHost) {
              const value = {
                userId: attendee.userId,
                audio: true,
              };
              ChimesendMessage(
                value,
                CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
              );
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
              const value = { userId: attendee.userId, audio: false };
              ChimesendMessage(
                value,
                CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
              );
            } else if (attendee.user_id === attendee.userId) {
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

export const LocalMicrophoneComponent = ({ className = "" }) => {
  const { muted, toggleMute } = useToggleLocalMute();
  return (
    <>
      {muted ? (
        <i
          className={`${styles.unmute_icon} ${styles.icon} ${className}`}
          onClick={() => {
            toggleMute();
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

export const CameraComponent = ({ ele, attendee, isHost, className = "" }) => {
  const { videoEnabled } = useAttendeeStatus(ele?.chimeAttendeeId);
  return (
    <>
      {!videoEnabled ? (
        <i
          className={`${styles.video_off_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if (isHost && !attendee.isHost) {
              const value = { userId: attendee.userId, video: true };
              ChimesendMessage(
                value,
                CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
              );
            }
          }}
        >
          videocam_off
        </i>
      ) : (
        <i
          className={`${styles.video_icon} ${styles.icon} ${className}`}
          onClick={() => {
            if (isHost && !attendee.isHost) {
              const value = {
                userId: attendee.userId,
                video: false,
              };
              ChimesendMessage(
                value,
                CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
              );
            }
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
  className = "",
}) => {
  const videoinput = useVideoInputs();
  const { isVideoEnabled, toggleVideo } = useLocalVideo();
  const audiovideo = useAudioVideo();
  return (
    <>
      {!isVideoEnabled ? (
        <i
          className={`${styles.video_off_icon} ${styles.icon} ${className}`}
          onClick={() => {
            toggleVideo();
          }}
        ></i>
      ) : (
        <i
          className={`${styles.video_icon} ${styles.icon} ${className} `}
          onClick={async () => {
            if (videoinput.devices.length !== 0) {
              if (!selectedDevice) {
                await audiovideo?.startVideoInput(videoinput.devices[0]);
                if (setselectedDevice) {
                  setselectedDevice(videoinput.devices[0]);
                }
              } else {
                await audiovideo?.startVideoInput(selectedDevice);
                if (setselectedDevice) {
                  setselectedDevice(selectedDevice);
                }
              }

              toggleVideo();
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

export const HangupComponent = ({ userdetails }) => {
  const { confirm } = Modal;
  const { EventData, handleExitMeeting }: any = useEventLayout();

  const HandleEndMeeting = () => {
    confirm({
      title: "Are you sure Do you want to Exit Meeting?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleExitMeeting(userdetails)
          .then(() => {
            ChimesendMessage(
              {
                name: userdetails?.name,
                userId: userdetails?.id,
                meetingId: EventData?.chime_meeting_id,
                isHost: userdetails?.isHost,
              },
              CHIME_SOCKET_EVENTS.USER_LEFT_MEETING
            );
            window.close();
          })
          .catch(() => {
            toast.error("Unable to end Meeting !");
          });
      },
      onCancel() {},
    });
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
