import React, { useEffect, useRef, useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import classes from "./Layout.module.css";
import Rlogo from "../Assets/Icons/svg/Events/Rawcasterlogo.svg";
import styles from "./MeetingLayout.module.css";
import {
  useAudioInputs,
  useAudioOutputs,
  useAudioVideo,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useRosterState,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { Modal, message } from "antd";
import { useEventLayout } from "../Components/Events/Room/EventValidaton";
import MeetingManagerComponent from "../Components/Events/Room/MeetingManagerComponent";
import { useAuthData, useAuthToken } from "../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../Services/ServiceConstants";
import { ChimesocketListen } from "../Services/SocketService";
import { MessageOutlined } from "@ant-design/icons";
import EventMenu from "../Components/Events/Components/EventMenu";
import TalkshowMenu from "../Components/Events/Components/TalkshowMenu";

export const useLayoutContect = () => {
  return useOutletContext();
};

const EventLayout = () => {
  const { EventData, attendeesList, notificationToast, setnotificationToast } =
    useEventLayout();
  const { confirm } = Modal;
  const token = useAuthToken();
  const audioRef = useRef();
  const videoRef = useRef();
  const [userdetails, setuserdetails] = useState(null);
  const userData = useAuthData();
  const { muted, toggleMute } = useToggleLocalMute();
  const audiovideo = useAudioVideo();
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const audioinput = useAudioInputs();
  const videoinput = useVideoInputs();
  const [isReactions, setisReactions] = useState(false);
  const [EventMessages, setEventMessages] = useState([]);
  const [RaiseHandUsers, setRaiseHandUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const { isVideoEnabled, toggleVideo, setIsVideoEnabled } = useLocalVideo();
  const [isNewMessage, setisNewMessage] = useState(false);

  const DeviceList = (List, onSelect) => {
    return List.map((ele, index) => {
      return {
        key: index + 1,
        label: (
          <div
            target="_blank"
            onClick={() => {
              onSelect(ele.deviceId);
            }}
          >
            {ele.label}
          </div>
        ),
      };
    });
  };

  useEffect(() => {
    if (attendeesList) {
      const findAttendee = attendeesList.find(
        (ele) => parseInt(ele.id) === parseInt(userData.user_id)
      );
      if (findAttendee) {
        setuserdetails(findAttendee);
      }
    }
  }, [attendeesList]);

  const useAttendeesList = () => {
    let filterValidAttendees = attendees.map((elem) => {
      let findAttendee = attendeesList.find(
        (ele) => parseInt(elem.externalUserId) === ele.id
      );
      if (findAttendee) {
        return { ...findAttendee };
      }
    });
    return { attendees: filterValidAttendees.filter((ele) => ele) };
  };

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
      async (message) => {
        console.log(message, "message");
        if (message.audio === false) {
          audioRef.current?.click();
          if (muted) {
            toggleMute();
          }
        } else if (message.audio === true) {
          Modal.confirm({
            title: "Host requests that you unmute your microphone",
            onOk() {
              audioRef.current?.click();
              if (muted) {
                toggleMute();
              }
            },
            onCancel() {},
          });
        } else if (message.video === false) {
          videoRef.current?.click();
          if (isVideoEnabled) {
            toggleVideo();
          }
        } else if (message.video === true) {
          Modal.confirm({
            title: "Host requests that you turn on camera",
            onOk() {
              videoRef.current?.click();
              if (!isVideoEnabled) {
                toggleVideo();
              }
            },
            onCancel() {},
          });
        }
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS);
    };
  }, [attendeesList]);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG, (data) => {
      if (EventData?.type !== 2) {
        setnotificationToast({
          show: true,
          msg: data.message,
          title: `${data.name}`,
          icon: <MessageOutlined />,
          buttons: [],
        });
      }
      setEventMessages((pre) => [data, ...pre]);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG);
    };
  }, [EventMessages]);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG, (data) => {
      if (EventData?.type !== 2) {
        setnotificationToast({
          show: true,
          msg: data.message,
          title: `${data.name} (Private)`,
          icon: <MessageOutlined />,
          buttons: [],
        });
      }
      setEventMessages((pre) => [data, ...pre]);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG);
    };
  }, [EventMessages]);

  return (
    <div className={`${EventData?.type === 2 ? classes.TalkshowHeader : ""}`}>
      {contextHolder}
      <div
        className={`${classes.topheader} ${classes.eventHeader} ${
          EventData?.type === 2 ? classes.TalkshowHeader : ""
        }`}
      >
        <div className={classes.meetingHeader}>
          <img src={Rlogo} />
          <h2>{EventData?.event_name}</h2>
        </div>
      </div>
      <Outlet
        context={{
          ...useEventLayout(),
          isHost: userdetails?.isHost,
          EventMessages,
          userdetails,
          setEventMessages,
          RaiseHandUsers,
          setRaiseHandUsers,
          useAttendeesList,
          notificationToast,
          setnotificationToast,
          isReactions,
          setisReactions,
        }}
      />
      {EventData?.type === 2 ? (
        <TalkshowMenu
          setRaiseHandUsers={setRaiseHandUsers}
          RaiseHandUsers={RaiseHandUsers}
          audioRef={audioRef}
          videoRef={videoRef}
          userdetails={userdetails}
          isReactions={isReactions}
          setisReactions={setisReactions}
          setisNewMessage={setisNewMessage}
        />
      ) : (
        <EventMenu
          setRaiseHandUsers={setRaiseHandUsers}
          RaiseHandUsers={RaiseHandUsers}
          audioRef={audioRef}
          videoRef={videoRef}
          userdetails={userdetails}
        />
      )}

      <MeetingManagerComponent setRaiseHandUsers={setRaiseHandUsers} />
    </div>
  );
};

export default EventLayout;
