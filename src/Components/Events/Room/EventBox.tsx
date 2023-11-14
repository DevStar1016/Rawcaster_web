import { useEffect } from "react";
import classes from "./EventBox.module.css";
import userImg from "../../../Assets/Images/svg/userImg.svg";
import {
  ContentShare,
  LocalVideo,
  RemoteVideo,
  useAttendeeStatus,
  useContentShareState,
  useLocalVideo,
  useRemoteVideoTileState,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import TalkshowParticipants from "./TalkshowParticipants";
import ChatBox from "./ChatBox";
import { Alert, Drawer, Layout, Modal, Spin, Tooltip } from "antd";
import { Toast, ToastContainer } from "react-bootstrap";
import Reactions from "../Components/Reactions";
import CommentBox from "./CommentBox";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import {
  CameraComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
  MicrophoneComponent,
} from "../Components/Utility";
import { useEventRoomContext } from "../../../Shared/Context";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { AttendeeUserData, EventContextProp } from "../Components/types";
import EventParticipants from "./EventParticipants";

const EventBox = () => {
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const { Content } = Layout;
  const { isVideoEnabled } = useLocalVideo();
  const {
    isPinEnabled,
    isChatorParticipant,
    setisChatorParticipant,
    isReactions,
    isFetching,
    notificationToast,
    setnotificationToast,
    attendeesList,
    userdata,
    EventData,
    isPresentScreen,
    MeetingSettings,
  }: EventContextProp = useEventRoomContext();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const { isLocalUserSharing, sharingAttendeeId } = useContentShareState();
  const { attendeeIdToTileId } = useRemoteVideoTileState();

  useEffect(()=>{
    if(EventData?.type === 2){
      setisChatorParticipant("participant")
    }
  },[EventData?.type])

  const enabledSettings = () => ({
    localVideoChangeAllowed: (userdata?.isHost || userdata?.isCoHost) ? true : MeetingSettings?.default_guest_video === 0 ? false : true,
    localMicChangeAllowed: (userdata?.isHost || userdata?.isCoHost) ? true : MeetingSettings?.default_guest_audio === 0 ? false : true,
  });

  /* To get Rawcaster user or non Rawcaster User */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  /* Dynamic Classname for Attendee Display boxes */

  const getContainerClassName = () => {
    const attendeesList = EventData?.type === 1 ? attendees.length : 
            ConvertSpotLightAttendee().otherAttendee?.length
    switch (attendeesList) {
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

  /* Options for Attendee Audio,Video Handling */

  const EventBoxOptions = ({ isYou, ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => elem.userRefId === ele.externalUserId
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
                <LocalMicrophoneComponent className={classes.icon} 
                isAllowed={enabledSettings().localMicChangeAllowed} />
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
                  setselectedDevice={null}
                  selectedDevice={null}
                  className={classes.icon}
                  isAllowed={enabledSettings().localVideoChangeAllowed} 
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
                  ChimesendMessage(
                    {
                      refId: EventData?.reference_id,
                      pin_enabled: isPinEnabled ? 0 : 1,
                      pinned_user_id: findAttendee?.userId,
                    },
                    CHIME_SOCKET_EVENTS.UPDATE_LAYOUT
                  );
                }}
              >
                <i className={`material-icons `}>filter_center_focus</i>
              </div>
            </Tooltip>
          )}

          {!isYou && (userdata?.isHost || userdata?.isCoHost) && !findAttendee?.isHost && (
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
                  if (userdata?.isHost || userdata?.isCoHost) {
                    Modal.confirm({
                      title: "Remove User",
                      content: "Are you sure you want to remove this participant?",
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
                  className="material-symbols-outlined"
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

  /* Name plate Design when video is enable */

  const CustomNamePlate = ({ ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => elem.userRefId === ele.externalUserId
    );
    const { muted } = useAttendeeStatus(ele?.chimeAttendeeId);

    const isYou = getUserData()?.user_id === findAttendee?.userId;
    return (
      <div>
        <div className={classes.customNamePlate}>
          {muted ? (
            <i className={classes.name_plate_mic_off_icon}></i>
          ) : (
            <i className={classes.name_plate_mic_on_icon}></i>
          )}
          {`${findAttendee?.name} ${isYou ? "(You)" : ""}`}
        </div>
        {findAttendee?.handRaised && (
          <div className={classes.isRaiseHand}>
            <i className={classes.raise_hand_active_icon}></i>
          </div>
        )}
      </div>
    );
  };

  /* List for whose layout is pinned by Host */

  function ConvertSpotLightAttendee  ()  {
    const spotlightAttendee = attendees.find(
      (ele) =>
        ele.externalUserId &&
        //@ts-ignore
        parseInt(ele.externalUserId) === parseInt(isPinEnabled)
    );

    const otherAttendee = attendees.filter(
      (ele) =>
        (ele.externalUserId && EventData?.type === 1) ||
        (((EventData?.type === 2 &&
          attendeesList.find((user) => user.userRefId === ele.externalUserId)
            ?.isHost) ||
          attendeesList.find((user) => user.userRefId === ele.externalUserId)
            ?.isCoHost) &&
          //@ts-ignore
          parseInt(ele.externalUserId) !== parseInt(isPinEnabled))
    );
    return {
      spotlightAttendee,
      otherAttendee,
    };
  };

  /* List for Each attendee or Host Video Enabled or not */

  const GetDisplayComponent = ({ ele }) => {
    const findAttendee = attendeesList.find(
      (elem: AttendeeUserData) => elem?.userRefId === ele.externalUserId
    );
    const value = attendeeIdToTileId[ele.chimeAttendeeId];
    const isYou = getUserData()?.user_id === findAttendee?.userId;

    if (findAttendee) {
      if (isYou && isVideoEnabled) {
        return (
          <div className={classes.Child}>
            {findAttendee?.isHost && (
              <div className={classes.hostLogo}>Host</div>
            )}
            {findAttendee?.isCoHost && (
              <div className={classes.hostLogo}>Co Host</div>
            )}
            <LocalVideo
              id={ele.id}
              className={classes.videoSec}
              // @ts-ignore
              nameplate={<CustomNamePlate ele={ele} />}
            ></LocalVideo>
           {/* removing audio video for now */}
          {/* <EventBoxOptions isYou={isYou} ele={ele} /> */}
          </div>
        );
      } else if (value) {
        return (
          <div className={classes.Child}>
            {findAttendee?.isHost && (
              <div className={classes.hostLogo}>Host</div>
            )}
             {findAttendee?.isCoHost && (
              <div className={classes.hostLogo}>Co Host</div>
            )}
            <RemoteVideo
              id={findAttendee.userId.toString()}
              className={classes.videoSec}
              // @ts-ignore
              name={<CustomNamePlate ele={ele} />}
              tileId={value}
            />
            {/* removing audio video for now */}
            {/* <EventBoxOptions isYou={isYou} ele={ele} /> */}
          </div>
        );
      } else {
        return (
          <div className={classes.Child}>
            {findAttendee?.isHost && (
              <div className={classes.hostLogo}>Host</div>
            )}
             {findAttendee?.isCoHost && (
              <div className={classes.hostLogo}>Co Host</div>
            )}
            {/* removing audio video for now */}
            {/* <EventBoxOptions isYou={isYou} ele={ele} /> */}
            <img
              className={classes.eventBoxUserImg}
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
        {/* removing audio video for now */}
        {/* <EventBoxOptions isYou={isYou} ele={ele} /> */}

        <img
          className={classes.eventBoxUserImg}
          src={userImg}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = userImg;
          }}
        />

        <p>{"User" + `${isYou ? " (You)" : ""}`}</p>
      </div>
    );
  };

  /* Share screen enabled for attendee or Host */

  const getisShareScreen = () => {
    if (isLocalUserSharing || sharingAttendeeId) {
      if (isPresentScreen) {
        return true;
      }
      return false;
    }
    return false;
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
          <div
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                zIndex: 13,
                pointerEvents: "none",
              }}
            >
              <Reactions showEmojList={isReactions} />
          </div>
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
                {getisShareScreen() ? (
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
                  msg: "",
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
                  showIcon={notificationToast.icon ? true : false}
                  style={{
                    background: "#fff",
                  }}
                  message={notificationToast.title}
                  description={notificationToast.msg}
                  onClose={() => {
                    setnotificationToast({
                      show: false,
                      msg: "",
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
              EventData?.type === 1 ? <EventParticipants /> : <TalkshowParticipants/>
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
          open={isChatorParticipant ? true : false}
          key={"bottom"}
          rootClassName="onlyMob"
          className="meetingDrawer onlyMob"
        >
          <div className={classes.participantsSec}>
            {isChatorParticipant === "participant" ? (
               EventData?.type === 1 ? <EventParticipants /> : <TalkshowParticipants/>
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
