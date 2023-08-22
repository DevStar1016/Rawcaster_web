import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import classes from "./Layout.module.css";
import Rlogo from "../Assets/Icons/svg/Events/Rawcasterlogo.svg";
import {
  useLocalVideo,
  useRosterState,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import { Layout, Modal, message } from "antd";
import { useEventLayout } from "../Components/Events/Room/EventValidaton";
import MeetingManagerComponent from "../Components/Events/Room/MeetingManagerComponent";
import { useAuthData } from "../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../Services/ServiceConstants";
import { ChimesocketListen } from "../Services/SocketService";
import { MessageOutlined } from "@ant-design/icons";
import TalkshowMenu from "../Components/Events/Components/TalkshowMenu";
import EventMenu from "../Components/Events/Components/EventMenu";

export const useLayoutContect = () => {
  return useOutletContext();
};

const EventLayout = () => {
  const {
    EventData,
    attendeesList,
    notificationToast,
    setnotificationToast,
    isChatorParticipant,
  } = useEventLayout();
  const { Header, Footer, Sider, Content } = Layout;
  const [userdetails, setuserdetails] = useState(null);
  const userData = useAuthData();
  const [isReactions, setisReactions] = useState(false);
  const [EventMessages, setEventMessages] = useState([]);
  const [RaiseHandUsers, setRaiseHandUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);

  const [isNewMessage, setisNewMessage] = useState(false);

  useEffect(() => {
    if (attendeesList) {
      const findAttendee = attendeesList.find(
        (ele) => parseInt(ele.userId) === parseInt(userData.user_id)
      );
      if (findAttendee) {
        setuserdetails(findAttendee);
      }
    }
  }, [attendeesList]);

  const useAttendeesList = () => {
    let filterValidAttendees = attendees.map((elem) => {
      let findAttendee = attendeesList.find(
        (ele) => parseInt(elem.externalUserId) === ele.userId
      );
      if (findAttendee) {
        return { ...findAttendee };
      }
    });
    return { attendees: filterValidAttendees.filter((ele) => ele) };
  };

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
      } else {
        if (isChatorParticipant !== "comment") {
          setisNewMessage("comment");
        }
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
      <Layout className={classes.EventLayoutContainer}>
        <Header className={classes.headerSec}>
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
        </Header>

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

        <Footer className={classes.footerSec}>
          {EventData?.type === 2 ? (
            <TalkshowMenu
              setRaiseHandUsers={setRaiseHandUsers}
              RaiseHandUsers={RaiseHandUsers}
              userdetails={userdetails}
              isReactions={isReactions}
              setisReactions={setisReactions}
              isNewMessage={isNewMessage}
              setisNewMessage={setisNewMessage}
            />
          ) : (
            <EventMenu
              setRaiseHandUsers={setRaiseHandUsers}
              RaiseHandUsers={RaiseHandUsers}
              userdetails={userdetails}
            />
          )}
        </Footer>

        {/* <MeetingManagerComponent setRaiseHandUsers={setRaiseHandUsers} /> */}
      </Layout>
    </div>
  );
};

export default EventLayout;
