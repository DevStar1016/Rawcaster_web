/**
 * A layout component for the event page.
 * @returns The event layout component.
 */
import { useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import classes from "./Layout.module.css";
import Rlogo from "../Assets/Icons/svg/Events/Rawcasterlogo.svg";
import {
  useContentShareControls,
  useContentShareState,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { Layout, Tooltip, message } from "antd";
import TalkshowMenu from "../Components/Events/Components/TalkshowMenu";
import EventMenu from "../Components/Events/Components/EventMenu";
import LoadingOverlay from "react-loading-overlay";
import { CHIME_SOCKET_EVENTS } from "../Services/ServiceConstants";
import { ChimesendMessage } from "../Services/SocketService";
import { EventContextProp } from "../Components/Events/Components/types";
import { useEventRoomContext } from "../Shared/Context";

export const useLayoutContect = () => {
  return useOutletContext<EventContextProp>();
};

const EventLayout = () => {
  const {
    EventData,
    attendeesList,
    notificationToast,
    setnotificationToast,
    isLoading,
    userdata,
    isEndLoading,
    isPresentScreen,
    setisPresentScreen,
  }: EventContextProp = useEventRoomContext();
  const { Header, Footer } = Layout;
  const [isReactions, setisReactions] = useState(false);
  const [RaiseHandUsers, setRaiseHandUsers] = useState([]);
  const [_, contextHolder] = message.useMessage();
  const { roster } = useRosterState();
  const { toggleContentShare } = useContentShareControls();
  const attendees = Object.values(roster);

  const { isLocalUserSharing, sharingAttendeeId } = useContentShareState();
  const [isNewMessage, setisNewMessage] = useState(false);

  /**
   * Custom hook that filters the list of attendees based on their external user ID.
   * @returns An object containing the filtered list of attendees.
   */
  const useAttendeesList = () => {
    // Filter out any attendees that have an externalUserId but not the userId
    let filterValidAttendees = attendees.map((elem) => {
      let findAttendee = attendeesList.find(
        (ele) =>
          elem.externalUserId && parseInt(elem.externalUserId) === ele.userId
      );
      if (findAttendee) {
        return { ...findAttendee };
      }
    });
    // Return the filtered list of attendees
    return { attendees: filterValidAttendees.filter((ele) => ele) };
  };

  /**
   * Retrieves the name of the attendee who is currently sharing content.
   * @returns {string} - The name of the sharing attendee, or "Someone's" if the attendee is not found.
   */
  const getSharingAttendee = () => {
    // Find the external user ID from the attendees list
    const findExternalUserId = attendees.find(
      (ele) => ele.chimeAttendeeId.concat("#content") === sharingAttendeeId
    );
    // If the external user ID exists, find the attendee from the attendees list
    if (findExternalUserId && findExternalUserId.externalUserId) {
      const findAttendee = attendeesList.find(
        (ele) =>
          findExternalUserId.externalUserId &&
          ele.userId === parseInt(findExternalUserId.externalUserId)
      );
      // If the attendee exists, return the name of the attendee plus's'
      if (findAttendee) {
        return findAttendee.name + "'s";
        // Otherwise, return 'Someone's'
      } else {
        return "Someone's";
      }
      // Otherwise, return 'Someone's'
    } else {
      return "Someone's";
    }
  };

  /**
   * Handles the closing of the share screen.
   * If the local user is sharing, it toggles the content share.
   * If there is a sharing attendee ID, it finds the corresponding external user ID and sends a message to disable screen sharing.
   * @returns None
   */
  const HandleCloseShareScreen = () => {
    // Check if the user is sharing a content
    if (isLocalUserSharing) {
      // Toggle the content share
      toggleContentShare();
    } else if (sharingAttendeeId) {
      // Find the external user id
      const findExternalUserId = attendees.find(
        (ele) => ele.chimeAttendeeId.concat("#content") === sharingAttendeeId
      );
      // Check if the user has an external user id
      if (findExternalUserId && findExternalUserId.externalUserId) {
        console.log({
          screen_share_status: false,
          refId: EventData?.reference_id,
          userId: parseInt(findExternalUserId.externalUserId),
        });

        // Send a message to the meeting in call
        ChimesendMessage(
          {
            screen_share_status: false,
            refId: EventData?.reference_id,
            hostId: userdata?.userId,
            userId: parseInt(findExternalUserId.externalUserId),
          },
          CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS
        );
      }
    }
  };

  return (
    <div className={`${EventData?.type === 2 ? classes.TalkshowHeader : ""}`}>
      {contextHolder}
      <LoadingOverlay
        active={isEndLoading || isLoading}
        spinner
        text={
          isEndLoading
            ? isEndLoading
            : userdata
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
                      className="material-symbols-outlined"
                      onClick={() => {
                        setisPresentScreen((pre) => !pre);
                      }}
                    >
                      switch_video
                    </span>
                  </div>
                </Tooltip>

                {(userdata?.isHost || isLocalUserSharing) && (
                  <Tooltip placement="bottomLeft" title={"Stop Presenting"}>
                    <div className={classes.iconSec}>
                      <span
                        className={`material-symbols-outlined ${classes.cancelIcon}`}
                        onClick={() => {
                          HandleCloseShareScreen();
                        }}
                      >
                        cancel
                      </span>
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
          </Header>

          <Outlet
            context={{
              ...useEventRoomContext(),
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
                isNewMessage={isNewMessage}
                setisNewMessage={setisNewMessage}
              />
            ) : (
              <EventMenu />
            )}
          </Footer>

          {/* <MeetingManagerComponent setRaiseHandUsers={setRaiseHandUsers} /> */}
        </Layout>
      </LoadingOverlay>
    </div>
  );
};

export default EventLayout;
