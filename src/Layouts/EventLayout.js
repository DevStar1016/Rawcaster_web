import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import classes from "./Layout.module.css";
import Rlogo from "../Assets/Icons/svg/Events/Rawcasterlogo.svg";
import {
  useLocalVideo,
  useRosterState,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import { Layout, message } from "antd";
import { useEventLayout } from "../Components/Events/Room/EventValidaton";
import TalkshowMenu from "../Components/Events/Components/TalkshowMenu";
import EventMenu from "../Components/Events/Components/EventMenu";
import LoadingOverlay from "react-loading-overlay";

export const useLayoutContect = () => {
  return useOutletContext();
};

const EventLayout = () => {
  const {
    EventData,
    attendeesList,
    notificationToast,
    setnotificationToast,
    isLoading,
    userdata,
  } = useEventLayout();
  const { Header, Footer } = Layout;
  const [isReactions, setisReactions] = useState(false);
  const [RaiseHandUsers, setRaiseHandUsers] = useState([]);
  const [_, contextHolder] = message.useMessage();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);

  const [isNewMessage, setisNewMessage] = useState(false);

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

  return (
    <div className={`${EventData?.type === 2 ? classes.TalkshowHeader : ""}`}>
      {contextHolder}
      <LoadingOverlay
        active={isLoading}
        spinner
        text={
          userdata
            ? userdata.isHost
              ? "Meeting Has Been Started ..."
              : "Joining Event Please Wait ..."
            : "Fetching User Details ..."
        }
      >
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
              isHost: userdata?.isHost,
              userdetails: userdata,
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
                userdetails={userdata}
                isReactions={isReactions}
                setisReactions={setisReactions}
                isNewMessage={isNewMessage}
                setisNewMessage={setisNewMessage}
              />
            ) : (
              <EventMenu
                setRaiseHandUsers={setRaiseHandUsers}
                RaiseHandUsers={RaiseHandUsers}
                userdetails={userdata}
              />
            )}
          </Footer>

          {/* <MeetingManagerComponent setRaiseHandUsers={setRaiseHandUsers} /> */}
        </Layout>
      </LoadingOverlay>
    </div>
  );
};

export default EventLayout;
