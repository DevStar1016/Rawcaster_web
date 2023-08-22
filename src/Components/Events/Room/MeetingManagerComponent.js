import { useEffect } from "react";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { Button, Modal } from "antd";
import { useEventRoomContextContext } from "../../../Shared/Context";
import {
  useLocalVideo,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";

const MeetingManagerComponent = () => {
  const {
    RequestRef,
    setnotificationToast,
    setisChatorParticipant,
    handleJoinMeeting,
    setEventData,
    setattendeesList,
  } = useEventRoomContextContext();
  const { toggleVideo, muted } = useLocalVideo();
  const { toggleMute, isVideoEnabled } = useToggleLocalMute();

  const onReceiveMessage = (e) => {
    const { key, newValue } = e;
    if (newValue) {
      console.log(key, newValue, "SOCKET_EVENT");
      switch (key) {
        case "EventData":
          try {
            const eventdetails = JSON.parse(newValue);
            setEventData(eventdetails);
          } catch (error) {
            console.log("Unable to Fetch meeting");
          }
          break;
        case CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER:
          try {
            const requestanswerDetails = JSON.parse(newValue);
            if (requestanswerDetails.joinInfo) {
              handleJoinMeeting(requestanswerDetails);
            } else {
              console.log(requestanswerDetails.message);
            }
          } catch (error) {
            console.log("Unable to Fetch meeting");
          }
          break;
        case CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER:
          try {
            const user_data = JSON.parse(newValue);
            setnotificationToast({
              show: true,
              msg: `${user_data?.name} wants to join this meeting`,
              title: null,
              type: null,
              buttons: [
                <Button
                  onClick={() => {
                    setisChatorParticipant("participant");
                  }}
                >
                  View
                </Button>,
              ],
              icon: null,
            });
            RequestRef.current.push(user_data);
          } catch (error) {
            console.log(error, "JOIN_REQUEST_FROM_USER ERR");
          }
          break;
        case CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING:
          try {
            const user_data = JSON.parse(newValue);
            setnotificationToast({
              show: true,
              msg: `${user_data?.name} wants to join this meeting`,
              title: null,
              type: null,
              buttons: [
                <Button
                  onClick={() => {
                    setisChatorParticipant("participant");
                  }}
                >
                  View
                </Button>,
              ],
              icon: null,
            });
            setattendeesList((pre) => [...pre, user_data]);
          } catch (error) {
            console.log(error, "JOIN_REQUEST_FROM_USER ERR");
          }
          break;
        case CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND:
          try {
            const user_data = JSON.parse(newValue);
            console.log(user_data);
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS:
          try {
            const message = JSON.parse(newValue);

            if (message.audio === false) {
              toggleMute();
            } else if (message.audio === true) {
              Modal.confirm({
                title: "Host requests that you unmute your microphone",
                onOk() {
                  toggleMute();
                },
                onCancel() {},
              });
            } else if (message.video === false) {
              toggleVideo();
            } else if (message.video === true) {
              Modal.confirm({
                title: "Host requests that you turn on camera",
                onOk() {
                  toggleVideo();
                },
                onCancel() {},
              });
            }
          } catch (error) {}
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("storage", onReceiveMessage);
    return () => {
      window.removeEventListener("storage", onReceiveMessage);
    };
  }, [muted, isVideoEnabled]);

  return <div></div>;
};

export default MeetingManagerComponent;
