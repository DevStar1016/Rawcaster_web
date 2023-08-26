import React, { useState } from "react";
import classes from "./EventBox.module.css";
import styles from "../../Events/Components/Menu.module.css";
import userImg from "../../../Assets/Images/svg/userImg.svg";
import {
  ContentShare,
  LocalVideo,
  RemoteVideo,
  useAttendeeStatus,
  useContentShareState,
  useLocalVideo,
  useMeetingManager,
  useRemoteVideoTileState,
  useRosterState,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import Participants from "./Participants";
import ChatBox from "./ChatBox";
import { Alert, Drawer, Layout, Modal, Spin, Tooltip } from "antd";
import { Toast, ToastContainer } from "react-bootstrap";
import Reactions from "../Components/Reactions";
import CommentBox from "./CommentBox";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import {
  CameraComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
  MicrophoneComponent,
} from "../Components/Utility";
import { useEventRoomContext } from "../../../Shared/Context";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";

const EventBox = () => {
  const userData = useAuthData();
  const { Sider, Content } = Layout;
  const { isVideoEnabled } = useLocalVideo();
  const {
    isPinEnabled,
    isChatorParticipant,
    isReactions,
    isFetching,
    notificationToast,
    setnotificationToast,
    attendeesList,
    userdata,
    EventData,
  } = useEventRoomContext();

  const { roster } = useRosterState();
  const attendees = Object.values(roster);
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

  const EventBoxOptions = ({ isYou, ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => parseInt(elem.userId) === parseInt(ele.externalUserId)
    );

    return (
      <div className={classes.eventMenu}>
        <div className={classes.eventOption}>
          <Tooltip placement="topLeft" title={"Enable Mic"}>
            <div
              className={classes.iconSec}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isYou ? (
                <LocalMicrophoneComponent ref={null} className={classes.icon} />
              ) : (
                <MicrophoneComponent
                  ele={ele}
                  attendee={findAttendee}
                  isHost={userdata?.isHost}
                  className={classes.icon}
                />
              )}
            </div>
          </Tooltip>
          <Tooltip placement="topLeft" title={"Enable Video"}>
            <div
              className={classes.iconSec}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isYou ? (
                <LocalCameraComponent
                  ref={null}
                  setselectedDevice={null}
                  selectedDevice={null}
                  className={classes.icon}
                />
              ) : (
                <CameraComponent
                  ele={ele}
                  attendee={findAttendee}
                  isHost={userdata?.isHost}
                  className={classes.icon}
                />
              )}
            </div>
          </Tooltip>

          {userdata?.isHost && isPinEnabled && (
            <Tooltip placement="topLeft" title={"Add Spotlight"}>
              <div
                className={`${userdata?.isHost ? "" : classes.disabledIcon} ${
                  classes.iconSec
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  console.log(findAttendee, "findAttendee");
                  ChimesendMessage(
                    {
                      refId: EventData?.reference_id,
                      view_type: 2,
                      spotlight_id: findAttendee?.userId,
                    },
                    CHIME_SOCKET_EVENTS.UPDATE_LAYOUT
                  );
                }}
              >
                <i className={`material-icons `}>filter_center_focus</i>
              </div>
            </Tooltip>
          )}

          {!isYou && (
            <Tooltip placement="topLeft" title={"Remove user"}>
              <div
                className={`${userdata?.isHost ? "" : classes.disabledIcon} ${
                  classes.iconSec
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  if (userdata?.isHost) {
                    Modal.confirm({
                      title: "Remove User",
                      content: "Are you sure do you want to remove this User !",
                      onOk: () => {
                        ChimesendMessage(
                          {
                            refId: EventData?.reference_id,
                            hostId: EventData?.original_user_id,
                            userId: findAttendee?.userId,
                          },
                          CHIME_SOCKET_EVENTS.KICK_USER
                        );
                      },
                      onCancel: () => {},
                    });
                  }
                }}
              >
                <span
                  class="material-symbols-outlined"
                  style={{
                    color: !userdata?.isHost ? "grey" : "",
                  }}
                >
                  cancel
                </span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  const CustomNamePlate = ({ ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => parseInt(elem.userId) === parseInt(ele.externalUserId)
    );
    const { muted } = useAttendeeStatus(ele?.chimeAttendeeId);

    const isYou = parseInt(userData.user_id) === parseInt(findAttendee.userId);
    return (
      <div>
        <div className={classes.customNamePlate}>
          {muted ? (
            <i className={classes.name_plate_mic_off_icon}></i>
          ) : (
            <i className={classes.name_plate_mic_on_icon}></i>
          )}
          {`${findAttendee.name} ${isYou ? "(You)" : ""}`}
        </div>
        {findAttendee.handRaised && (
          <div className={classes.isRaiseHand}>
            <i className={classes.raise_hand_active_icon}></i>
          </div>
        )}
      </div>
    );
  };

  const ConvertSpotLightAttendee = () => {
    const spotlightAttendee = attendees.find(
      (ele) => parseInt(ele.externalUserId) === parseInt(isPinEnabled)
    );
    const otherAttendee = attendees.filter(
      (ele) => parseInt(ele.externalUserId) !== parseInt(isPinEnabled)
    );
    return {
      spotlightAttendee,
      otherAttendee,
    };
  };

  const GetDisplayComponent = ({ ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => parseInt(elem?.userId) === parseInt(ele.externalUserId)
    );
    const value = attendeeIdToTileId[ele.chimeAttendeeId];
    const isYou = parseInt(userData.user_id) === parseInt(findAttendee?.userId);

    if (findAttendee) {
      if (isYou && isVideoEnabled) {
        return (
          <div className={classes.Child}>
            {findAttendee?.isHost && (
              <div className={classes.hostLogo}>Host</div>
            )}
            <LocalVideo
              id={ele.id}
              className={classes.videoSec}
              nameplate={<CustomNamePlate ele={ele} />}
            ></LocalVideo>
            <EventBoxOptions isYou={isYou} ele={ele} />
          </div>
        );
      } else if (value) {
        return (
          <div className={classes.Child}>
            {findAttendee?.isHost && (
              <div className={classes.hostLogo}>Host</div>
            )}
            <RemoteVideo
              id={findAttendee.userId}
              className={classes.videoSec}
              name={<CustomNamePlate ele={ele} />}
              tileId={value}
            />

            <EventBoxOptions isYou={isYou} ele={ele} />
          </div>
        );
      } else {
        return (
          <div className={classes.Child}>
            {findAttendee?.isHost && (
              <div className={classes.hostLogo}>Host</div>
            )}
            <EventBoxOptions isYou={isYou} ele={ele} />
            <img
              src={findAttendee.image ? findAttendee.image : ""}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = userImg;
              }}
            />
            <p>{findAttendee.name + `${isYou ? " (You)" : ""}`}</p>
            {findAttendee.handRaised && (
              <div className={classes.RaisehandContainer}>
                <div className={classes.isRaiseHand}>
                  <i className={classes.raise_hand_active_icon}></i>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return (
      <div className={classes.Child}>
        <EventBoxOptions isYou={isYou} ele={ele} />
        <img
          src={findAttendee?.image ? findAttendee.image : ""}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = userImg;
          }}
        />
        <p>{"User" + `${isYou ? " (You)" : ""}`}</p>
      </div>
    );
  };

  return (
    <div className={classes.mainContainer}>
      <Content>
        <div
          className={classes.video_grid}
          style={{
            width: !isFetching && isChatorParticipant ? "80" : "100%",
          }}
        >
          {isReactions && (
            <div
              style={{
                position: "absolute",
                height: "88%",
                width: "100%",
                zIndex: 13,
              }}
            >
              <Reactions />
            </div>
          )}
          {isFetching ? (
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">
              <Spin />
            </div>
          ) : (
            <>
              <div
                className={
                  // isPinEnabled && attendees.length >= 10
                  isPinEnabled ? classes.isPinavailablePinSec : classes.PinSec
                }
              >
                {/* {isPinEnabled && attendees.length >= 10 && ( */}
                {isPinEnabled &&
                  ConvertSpotLightAttendee()?.spotlightAttendee && (
                    <div className={classes.pinned_video}>
                      {GetDisplayComponent({
                        ele: ConvertSpotLightAttendee()?.spotlightAttendee,
                      })}
                    </div>
                  )}
              </div>
              <div
                className={
                  // isPinEnabled && attendees.length >= 10
                  isPinEnabled
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
                    {ConvertSpotLightAttendee().otherAttendee?.map(
                      (ele, index) => {
                        return GetDisplayComponent({ ele });
                      }
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          <ToastContainer position="top-end" className="eventpopupContainer">
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
              autohide
              delay={3000}
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
      </Content>
      <div className="onlydes">
        {isChatorParticipant && (
          <div className={classes.participantsSec}>
            {isChatorParticipant === "participant" ? (
              <Participants />
            ) : isChatorParticipant === "chat" ? (
              <ChatBox />
            ) : isChatorParticipant === "comment" ? (
              <CommentBox />
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
            ) : isChatorParticipant === "comment" ? (
              <CommentBox />
            ) : null}
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default EventBox;
