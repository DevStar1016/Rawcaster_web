import React from "react";
import classes from "./EventBox.module.css";
import userImg from "../../../Assets/Images/svg/userImg.svg";
import {
  ContentShare,
  LocalVideo,
  RemoteVideo,
  useContentShareState,
  useLocalVideo,
  useRemoteVideoTileState,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import Participants from "./Participants";
import ChatBox from "./ChatBox";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import { Alert, Button, Drawer, Spin } from "antd";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { Toast, ToastContainer } from "react-bootstrap";
import { MessageOutlined } from "@ant-design/icons";

const EventBox = () => {
  const userData = useAuthData();
  const { isVideoEnabled } = useLocalVideo();
  const { roster } = useRosterState();
  const {
    isPinEnabled,
    isChatorParticipant,

    isFetching,
    useAttendeesList,
    notificationToast,
    setnotificationToast,
  } = useLayoutContect();
  const { attendees } = useAttendeesList();

  const { isLocalUserSharing, sharingAttendeeId } = useContentShareState();
  const { attendeeIdToTileId } = useRemoteVideoTileState();

  const getContainerClassName = () => {
    switch (attendees.length) {
      case 1:
        return classes.full_container;
      case 2:
        return classes.Half_container;
      case 3:
        return classes.grid_initial_3_boxes;
      case 4:
        return classes.grid_initial_4_boxes;
      case 5:
        return classes.grid_initial_5_boxes;
      case 6:
        return classes.grid_initial_5_boxes;
      case 7:
        return classes.grid_4_boxes;
      case 8:
        return classes.grid_4_boxes;
      default:
        return isChatorParticipant
          ? classes.grid_4_boxes
          : classes.grid_5_boxes;
    }
  };

  const GetDisplayComponent = ({ ele }) => {
    const value = attendeeIdToTileId[ele.AttendeeId];
    console.log(ele);
    if (ele) {
      if (parseInt(userData.user_id) === parseInt(ele.id) && isVideoEnabled) {
        return (
          <LocalVideo
            id={ele.id}
            className={classes.Child}
            nameplate={`${ele.name} (You)`}
          />
        );
      } else if (value) {
        return (
          <RemoteVideo
            id={ele.id}
            className={classes.Child}
            name={ele.name}
            nameplate={ele.name}
            tileId={value}
          />
        );
      } else {
        return (
          <div className={classes.Child}>
            <img
              src={ele.image ? ele.image : ""}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = userImg;
              }}
            />
            <p>{ele.name}</p>
          </div>
        );
      }
    }
    return (
      <div className={classes.Child}>
        <img
          src={ele?.image ? ele.image : ""}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = userImg;
          }}
        />
        <p>{ele.name}</p>
      </div>
    );
  };

  return (
    <div className={classes.mainContainer}>
      <div
        className={classes.video_grid}
        style={{
          width: !isFetching && isChatorParticipant ? "80" : "100%",
        }}
      >
        {isFetching ? (
          <div className="h-100 w-100 d-flex justify-content-center align-items-center">
            <Spin />
          </div>
        ) : (
          <>
            <div
              className={
                isPinEnabled && attendees.length >= 10
                  ? classes.isPinavailablePinSec
                  : classes.PinSec
              }
            >
              {isPinEnabled && attendees.length >= 10 && (
                <div className={classes.pinned_video}>
                  <img src={userImg} />
                  <p>{"Participant "}</p>
                </div>
              )}
            </div>
            <div
              className={
                isPinEnabled && attendees.length >= 10
                  ? classes.isPinavailableSec
                  : classes.ParticipantSec
              }
              style={{
                overflow: "scroll",
              }}
            >
              {isLocalUserSharing || sharingAttendeeId ? (
                <div className={classes.full_container}>
                  <ContentShare className={classes.Child} />
                </div>
              ) : (
                <div className={`mx-auto ${getContainerClassName()}`}>
                  {attendees.map((ele, index) => {
                    return GetDisplayComponent({ ele });
                  })}
                </div>
              )}
            </div>
          </>
        )}
        <ToastContainer position="bottom-end" className="eventpopupContainer">
          <Toast
            onClose={() => {
              setnotificationToast({
                show: false,
                msg: null,
                title: null,
                type: null,
                buttons: [],
                icon: null,
              });
            }}
            show={notificationToast.show}
          >
            <Toast.Body
              style={{
                backgroundColor: "transparent",
              }}
            >
              <Alert
                icon={notificationToast.icon}
                showIcon={notificationToast.icon}
                style={{
                  background: "#fff",
                }}
                message={notificationToast.title}
                description={notificationToast.msg}
                onClose={() => {
                  setnotificationToast({
                    show: false,
                    msg: null,
                    title: null,
                    type: null,
                    buttons: [],
                    icon: null,
                  });
                }}
                action={<>{notificationToast.buttons.map((ele) => ele)}</>}
                closable
              />
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
      <div className="onlydes">
        {isChatorParticipant && (
          <div className={classes.participantsSec}>
            {isChatorParticipant === "participant" ? (
              <Participants />
            ) : isChatorParticipant === "chat" ? (
              <ChatBox />
            ) : null}
          </div>
        )}
      </div>
      <div className="onlyMob eventContainer">
        <Drawer
          placement={"bottom"}
          closable={false}
          open={isChatorParticipant}
          key={"bottom"}
          rootClassName="onlyMob"
          className="meetingDrawer onlyMob"
        >
          <div className={classes.participantsSec}>
            {isChatorParticipant === "participant" ? (
              <Participants />
            ) : isChatorParticipant === "chat" ? (
              <ChatBox />
            ) : null}
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default EventBox;
