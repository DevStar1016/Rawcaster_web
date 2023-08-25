import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { toast } from "react-hot-toast";

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
