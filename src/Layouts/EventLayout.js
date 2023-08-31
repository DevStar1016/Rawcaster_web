import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import classes from "./Layout.module.css";
import Rlogo from "../Assets/Icons/svg/Events/Rawcasterlogo.svg";
import {
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useRosterState,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import { Layout, Tooltip, message } from "antd";
import { useEventLayout } from "../Components/Events/Room/EventValidaton";
import TalkshowMenu from "../Components/Events/Components/TalkshowMenu";
import EventMenu from "../Components/Events/Components/EventMenu";
import LoadingOverlay from "react-loading-overlay";
import { CHIME_SOCKET_EVENTS } from "../Services/ServiceConstants";
import { ChimesendMessage } from "../Services/SocketService";

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
  const { toggleContentShare } = useContentShareControls();
  const attendees = Object.values(roster);
  const [isPresentScreen, setisPresentScreen] = useState(false);
  const { isLocalUserSharing, sharingAttendeeId } = useContentShareState();

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

  const getSharingAttendee = () => {
    const findExternalUserId = attendees.find(
      (ele) => ele.chimeAttendeeId.concat("#content") === sharingAttendeeId
    );
    if (findExternalUserId) {
      const findAttendee = attendeesList.find(
        (ele) =>
          parseInt(ele.userId) === parseInt(findExternalUserId.externalUserId)
      );
      if (findAttendee) {
        return findAttendee.name + "'s";
      } else {
        return "Someone's";
      }
    } else {
      return "Someone's";
    }
  };

  const HandleCloseShareScreen = () => {
    if (isLocalUserSharing) {
      toggleContentShare();
    } else if (sharingAttendeeId) {
      const findExternalUserId = attendees.find(
        (ele) => ele.chimeAttendeeId.concat("#content") === sharingAttendeeId
      );
      ChimesendMessage(
        {
          screen_share_status: false,
          refId: EventData?.reference_id,
          userId: parseInt(findExternalUserId.externalUserId),
        },
        CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
      );
    }
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
            : "Fetching Event Details ..."
        }
      >
        <Layout
          className={classes.EventLayoutContainer}
          style={{ minHeight: "100vh" }}
        >
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
            {(isLocalUserSharing || sharingAttendeeId) && (
              <div
                className={`${classes.meetingHeader} ${classes.endContainer}`}
              >
                <h3>
                  {isLocalUserSharing ? "Your" : getSharingAttendee()} screen is
                  presenting
                </h3>

                <Tooltip
                  placement="bottomLeft"
                  title={isPresentScreen ? "Switch Video" : "Switch Presenting"}
                >
                  <div className={classes.iconSec}>
                    <span
                      class="material-symbols-outlined"
                      onClick={() => {
                        setisPresentScreen((pre) => !pre);
                      }}
                    >
                      switch_video
                    </span>
                  </div>
                </Tooltip>

                {userdata?.isHost ||
                  (isLocalUserSharing && (
                    <Tooltip placement="bottomLeft" title={"Stop Presenting"}>
                      <div className={classes.iconSec}>
                        <span
                          class={`material-symbols-outlined ${classes.cancelIcon}`}
                          onClick={() => {
                            HandleCloseShareScreen();
                          }}
                        >
                          cancel
                        </span>
                      </div>
                    </Tooltip>
                  ))}
              </div>
            )}
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
              isPresentScreen,
              setisPresentScreen,
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
