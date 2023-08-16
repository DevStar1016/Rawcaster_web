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
                userId: attendee.id,
                audio: true,
              };
              ChimesendMessage(
                value,
                CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
              );
            } else if (attendee.user_id === attendee.id) {
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
              const value = { userId: attendee.id, audio: false };
              ChimesendMessage(
                value,
                CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
              );
            } else if (attendee.user_id === attendee.id) {
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
              const value = { userId: attendee.id, video: true };
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
                userId: attendee.id,
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
