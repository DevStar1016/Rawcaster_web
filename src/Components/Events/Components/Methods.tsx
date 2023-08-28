import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { toast } from "react-hot-toast";
import {
  useAudioInputs,
  useAudioOutputs,
  useAudioVideo,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";
import styles from "./Menu.module.css";

interface ExitMeeting {
  Attendee: any;
  EventData?: any;
  handleExitMeeting: any;
  message?: String;
}

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
          toast.error("Unable to exit Meeting !");
        });
    },
    onCancel() {},
  });
};

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

export const EndMeeting = (props: ExitMeeting) => {
  const { Attendee, EventData, handleExitMeeting } = props;
  const { confirm } = Modal;

  confirm({
    title: "Are you sure Do you want to End Meeting?",
    icon: <ExclamationCircleFilled />,
    onOk() {
      handleExitMeeting(Attendee)
        .then(() => {
          ChimesendMessage(
            { refId: EventData?.reference_id, hostId: Attendee?.userId },
            CHIME_SOCKET_EVENTS.END_MEETING
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

type MicOptionsProps = {
  TextColor?: any;
};

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
                } catch (error) {
                  console.log("SpeakerSelection failed to select speaker");
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
    </div>
  );
};
