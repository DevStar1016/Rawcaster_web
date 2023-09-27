import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, message } from "antd";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { toast } from "react-hot-toast";
import {
  MeetingManager,
  useAudioInputs,
  useAudioOutputs,
  useAudioVideo,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";
import styles from "./Menu.module.css";
import { EventDataProp } from "../Configure/types";
import { AttendeeUserData, EventContextProp } from "./types";
import { useEventRoomContext } from "../../../Shared/Context";

type ExitMeeting = {
  Attendee?: AttendeeUserData | undefined;
  EventData?: EventDataProp | null;
  handleExitMeeting?: any;
  message?: String;
};

type EndMeeting = {
  Attendee?: AttendeeUserData | undefined;
  EventData?: EventDataProp | null;
  handleEndMeeting: any;
  message?: String;
  meetingmanager?: MeetingManager;
};

/**
 * Displays a confirmation modal to prompt the user if they want to exit the meeting.
 * If the user confirms, it calls the handleExitMeeting function and performs necessary actions.
 * @param {ExitMeeting} props - The props object containing Attendee, EventData, and handleExitMeeting.
 * @returns None
 */
export const ExitMeeting = (props: ExitMeeting) => {
  const { Attendee, EventData, handleExitMeeting } = props;
  const { confirm } = Modal;
  confirm({
    title: "Are you sure Do you want to Exit Meeting?",
    icon: <ExclamationCircleFilled />,
    onOk() {
      handleExitMeeting(Attendee)
        .then(() => {
          ChimesendMessage(
            {
              name: Attendee?.name,
              userId: Attendee?.userId,
              refId: EventData?.reference_id,
              isHost: Attendee?.isHost,
            },
            CHIME_SOCKET_EVENTS.USER_LEFT_MEETING
          );
          window.close();
        })
        .catch(() => {
          toast.remove("Error");
          toast.error("Unable to exit Meeting !", {
            id: "Error",
          });
        });
    },
    onCancel() {},
  });
};

/**
 * Displays a warning modal with the given message and closes the window when the user clicks "OK".
 * @param {ExitMeeting} props - The props object containing the message to display.
 * @returns None
 */
export const EndAttendeeMeeting = (props: ExitMeeting) => {
  const { message } = props;
  const { warning } = Modal;
  warning({
    title: message,
    icon: <ExclamationCircleFilled />,
    onOk() {
      window.close();
    },
  });
};

/**
 * Renders a confirmation modal to end a meeting for all attendees.
 * @param {EndMeeting} props - The props object containing the necessary data and functions.
 * @returns None
 */
export const EndMeeting = (props: EndMeeting) => {
  const { Attendee, EventData, handleEndMeeting, meetingmanager } = props;
  const { confirm } = Modal;

  confirm({
    title: "Are you sure Do you want to End Meeting For All?",
    icon: <ExclamationCircleFilled />,
    onOk() {
      handleEndMeeting(Attendee)
        .then(() => {
          ChimesendMessage(
            { refId: EventData?.reference_id, hostId: Attendee?.userId },
            CHIME_SOCKET_EVENTS.END_MEETING
          );

          meetingmanager?.meetingSession?.destroy();
          window.close();
        })
        .catch(() => {
          toast.remove("Error");
          toast.error("Unable to end Meeting !", {
            id: "Error",
          });
        });
    },
    onCancel() {},
  });
};

type MicOptionsProps = {
  TextColor?: string | undefined;
};

/**
 * Component for displaying microphone and speaker options.
 * @param {MicOptionsProps} props - The props for the MicOptions component.
 * @returns JSX element representing the microphone and speaker options.
 */
export const MicOptions = (props: MicOptionsProps) => {
  const { TextColor } = props;
  const meetingmanager = useMeetingManager();
  const audioinput = useAudioInputs();
  const audiovideo = useAudioVideo();
  const audiooutput = useAudioOutputs();

  return (
    <div
      className={styles.micdropDown}
      style={{
        color: TextColor ? TextColor : "#000000",
      }}
    >
      <h3 className="onlydes">Microphone</h3>
      {audioinput.devices.map((ele) => {
        const getisActive = () => audioinput.selectedDevice === ele.deviceId;
        return (
          <span
            onClick={async () => {
              if (audiovideo) {
                try {
                  await meetingmanager.startAudioInputDevice(ele.deviceId);
                } catch (error) {
                  console.error("Error setting speaker device:", error);
                }
              }
            }}
          >
            <i
              className="material-symbols-outlined"
              style={{
                color: getisActive()
                  ? TextColor
                    ? TextColor
                    : "black"
                  : "transparent",
              }}
            >
              done
            </i>
            {ele.label}
          </span>
        );
      })}
      <h3 className="onlydes">Speaker</h3>
      {audiooutput.devices.map((ele) => {
        const getisActive = () => audiooutput.selectedDevice === ele.deviceId;
        return (
          <span
            className="onlydes"
            onClick={async () => {
              if (audiovideo) {
                try {
                  await meetingmanager.startAudioOutputDevice(ele.deviceId);
                } catch (error) {}
              }
            }}
          >
            <i
              className="material-symbols-outlined"
              style={{
                color: getisActive()
                  ? TextColor
                    ? TextColor
                    : "black"
                  : "transparent",
              }}
            >
              done
            </i>

            {ele.label}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Component for the host exit option in a meeting.
 * @returns JSX element representing the host exit option.
 */
export const HostExitOption = () => {
  const {
    EventData,
    handleExitMeeting,
    handleEndMeeting,
    userdata,
    setisChatorParticipant,
    attendeesList,
  }: EventContextProp = useEventRoomContext();
  const meetingmanager = useMeetingManager();
  const [messageApi, contextHolder] = message.useMessage();

  const validateMeetingLeave = (): boolean => {
    if (userdata?.isHost || userdata?.isCoHost) {
      const validAttendees = attendeesList.filter(
        (item) => item.userId !== userdata.userId && (item.isHost || item.isCoHost)
      );
      return validAttendees.length < 1;
    }
  
    return false;
  };
  
  return (
    <div className={styles.HostLeaveSec}>
      {contextHolder}
      <div
        className={`${styles.Actionsec} ${styles.HostEndActionsec}`}
        onClick={() => {
          if (validateMeetingLeave()) {
            Modal.confirm({
              type: "confirm",
              content: "Please make someone as host before leaving the meeting",
              onOk: () => {
                setisChatorParticipant("participant");
              },
              onCancel: () => {},
            });
          } else {
            ExitMeeting({
              Attendee: userdata,
              EventData,
              handleExitMeeting,
            });
          }
        }}
      >
        <div className={`${styles.iconBox} ${styles.HostEndIcon}`}>
          <span
            className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
          >
            logout
          </span>
        </div>
        {"Leave"}
      </div>
      <div
        className={`${styles.Actionsec} ${styles.HostEndActionsec}`}
        onClick={() => {
          EndMeeting({
            Attendee: userdata,
            EventData,
            handleEndMeeting,
            meetingmanager,
          });
        }}
      >
        <div className={` ${styles.EndIcon} ${styles.HostEndIcon}`}>
          <i className={`${styles.hang_up_icon} ${styles.icon}`}></i>
        </div>
        {"End"}
      </div>
    </div>
  );
};
