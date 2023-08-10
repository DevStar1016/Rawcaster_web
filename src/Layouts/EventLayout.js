import React, { useEffect, useState } from "react";
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
import { Badge, Button, Dropdown, Modal, message } from "antd";
import { useEventLayout } from "../Components/Events/Room/EventValidaton";
import MeetingManagerComponent from "../Components/Events/Room/MeetingManagerComponent";
import { useAuthData, useAuthToken } from "../Shared/Reduxfetcher";
import { CHIME_SOCKET_EVENTS } from "../Services/ServiceConstants";
import { ChimesendMessage, ChimesocketListen } from "../Services/SocketService";
import { toast } from "react-hot-toast";
import { ExclamationCircleFilled, MessageOutlined } from "@ant-design/icons";

export const useLayoutContect = () => {
  return useOutletContext();
};

const EventLayout = () => {
  const {
    isChatorParticipant,
    setisChatorParticipant,
    isPinEnabled,
    setisPinEnabled,
    EventData,
    attendeesList,
    RequestRef,
    handleExitMeeting,
    notificationToast,
    setnotificationToast,
  } = useEventLayout();
  const { confirm } = Modal;
  const token = useAuthToken();

  const [userdetails, setuserdetails] = useState(null);
  const userData = useAuthData();
  const { muted, toggleMute } = useToggleLocalMute();
  const audiovideo = useAudioVideo();
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const audioinput = useAudioInputs();
  const videoinput = useVideoInputs();
  const [EventMessages, setEventMessages] = useState([]);
  const [RaiseHandUsers, setRaiseHandUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const { isVideoEnabled, toggleVideo, setIsVideoEnabled } = useLocalVideo();

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
    let filterValidAttendees = attendeesList.filter((elem) => {
      let findAttendee = attendees.find(
        (ele) => parseInt(ele.externalUserId) === elem.id
      );
      if (findAttendee) {
        return { ...findAttendee, ...elem };
      }
    });
    console.log(
      attendees,
      filterValidAttendees.filter((ele) => ele)
    );
    return { attendees: filterValidAttendees.filter((ele) => ele) };
  };

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
      async (message) => {
        console.log(message, "message");
        if (message.audio === false) {
          toggleMute();
          await audiovideo.stopAudioInput();
        } else if (message.audio === true) {
          Modal.confirm({
            title: "Host requests that you unmute your microphone",
            onOk() {
              audiovideo.startAudioInput();
              toggleMute();
            },
            onCancel() {},
          });
        } else if (message.video === false) {
          toggleVideo();
          await audiovideo.stopVideoInput();
        } else if (message.video === true) {
          Modal.confirm({
            title: "Host requests that you turn on camera",
            onOk() {
              audiovideo.startVideoInput();
              toggleVideo();
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
      setnotificationToast({
        show: true,
        msg: data.message,
        title: `${data.name}`,
        icon: <MessageOutlined />,
        buttons: [],
      });
      setEventMessages((pre) => [data, ...pre]);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG);
    };
  }, [EventMessages]);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG, (data) => {
      setnotificationToast({
        show: true,
        msg: data.message,
        title: `${data.name} (Private)`,
        icon: <MessageOutlined />,
        buttons: [],
      });

      setEventMessages((pre) => [data, ...pre]);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG);
    };
  }, [EventMessages]);

  const getisActiveRaiseHand = () => {
    const findData = RaiseHandUsers.find((ele) => ele.id === userdetails?.id);
    return findData;
  };

  return (
    <div>
      {contextHolder}
      <div className={`${classes.topheader} ${classes.eventHeader}`}>
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
        }}
      />

      <div className={styles.BottomContainer}>
        <div className={styles.startContainer}>
          <div className="d-flex flex-row">
            <div className={styles.Actionsec}>
              <div>
                {muted ? (
                  <i
                    className={`${styles.unmute_icon} ${styles.icon}`}
                    onClick={() => {
                      toggleMute();
                    }}
                  ></i>
                ) : (
                  <i
                    className={`${styles.mute_icon} ${styles.icon}`}
                    onClick={async () => {
                      await audiovideo.startAudioInput();
                      toggleMute();
                    }}
                  ></i>
                )}
                <Dropdown
                  menu={{
                    items: DeviceList(audioinput.devices, async (id) => {
                      audiovideo.startAudioInput(id);
                    }),
                  }}
                  placement="top"
                >
                  <div
                    style={{
                      color: "white",
                    }}
                  >
                    <span className="material-symbols-outlined">
                      expand_less
                    </span>
                  </div>
                </Dropdown>
              </div>
              {muted ? <>Unmute</> : <>Mute</>}
            </div>
          </div>
          <div className="d-flex flex-row">
            <div className={styles.Actionsec}>
              <div>
                {isVideoEnabled ? (
                  <i
                    className={`${styles.video_off_icon} ${styles.icon}`}
                    onClick={() => {
                      toggleVideo();
                    }}
                  ></i>
                ) : (
                  <i
                    className={`${styles.video_icon} ${styles.icon}`}
                    onClick={async () => {
                      if (videoinput.devices.length !== 0) {
                        await audiovideo.startVideoInput(videoinput.devices[0]);
                        toggleVideo();
                      }
                    }}
                  ></i>
                )}
                {videoinput.devices.length !== 0 && (
                  <Dropdown
                    menu={{
                      items: DeviceList(videoinput.devices, async (id) => {
                        console.log(id, "ididididid");
                        audiovideo
                          .startVideoInput(id)
                          .then((res) => {
                            console.log(res);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }),
                    }}
                    placement="top"
                  >
                    <div
                      // className={styles.DropdownBtn}
                      style={{
                        color: "white",
                      }}
                    >
                      <span className="material-symbols-outlined">
                        expand_less
                      </span>
                    </div>
                  </Dropdown>
                )}
              </div>
              {isVideoEnabled ? <>Stop video</> : <>Start video</>}
            </div>
          </div>
        </div>
        <div style={{ width: "40%" }} className="onlydes">
          <div
            className={styles.Actionsec}
            style={{
              color: isLocalUserSharing ? "#F2718D" : "#FFFFFF",
            }}
            onClick={() => {
              toggleContentShare();
            }}
          >
            <i
              className={`${styles.present_icon} ${styles.icon}`}
              style={{
                background: isLocalUserSharing ? "#F2718D" : "#FFFFFF",
              }}
            ></i>
            Present
          </div>
        </div>
        <div className={`${styles.endContainer} ${styles.onlydes} onlydes`}>
          {userdetails?.isHost && (
            <div className={styles.Actionsec}>
              <i className={`${styles.present_icon} ${styles.icon}`}></i>
              Allow
            </div>
          )}
          {userdetails?.isHost && (
            <div
              className={styles.Actionsec}
              onClick={() => {
                setisPinEnabled(!isPinEnabled);
              }}
            >
              <i className="material-symbols-outlined">grid_view</i>
              View
            </div>
          )}
          <div
            className={styles.Actionsec}
            style={{
              color: getisActiveRaiseHand() ? "#F2718D" : "#ffffff",
            }}
            onClick={() => {
              if (getisActiveRaiseHand()) {
                ChimesendMessage(
                  {
                    user_id: userdetails?.id,
                    meetingId: EventData?.chime_meeting_id,
                    raise_hand: false,
                  },
                  CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                );
                setRaiseHandUsers((pre) =>
                  pre.filter((ele) => ele.id !== userdetails?.id)
                );
              } else {
                ChimesendMessage(
                  {
                    user_id: userdetails?.id,
                    meetingId: EventData?.chime_meeting_id,
                    raise_hand: true,
                  },
                  CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                );
                setRaiseHandUsers((pre) => [...pre, userdetails]);
              }
            }}
          >
            <i
              className={` ${
                getisActiveRaiseHand()
                  ? styles.raise_hand_active_icon
                  : styles.raise_hand_icon
              } ${styles.icon}`}
            ></i>
            Raise Hand
          </div>

          <div
            className={styles.Actionsec}
            onClick={() => {
              if (isChatorParticipant === "participant") {
                setisChatorParticipant(null);
              } else {
                setisChatorParticipant("participant");
              }
            }}
          >
            <Badge
              size="small"
              count={RequestRef.current?.length || 0}
              offset={[5, 0]}
            >
              <i className={`${styles.participant_icon} ${styles.icon}`}></i>
            </Badge>
            Participant
          </div>

          <div
            className={styles.Actionsec}
            onClick={() => {
              if (isChatorParticipant === "chat") {
                setisChatorParticipant(null);
              } else {
                setisChatorParticipant("chat");
              }
            }}
          >
            <i className={`${styles.chat_icon} ${styles.icon}`}></i>
            Chat
          </div>
          <div
            className={styles.Actionsec}
            style={{
              color: "red",
            }}
            onClick={() => {
              confirm({
                title: "Are you sure Do you want to Exit Meeting?",
                icon: <ExclamationCircleFilled />,
                onOk() {
                  handleExitMeeting(userdetails)
                    .then(() => {
                      ChimesendMessage(
                        {
                          name: userdetails?.name,
                          userId: userdetails?.id,
                          meetingId: EventData?.chime_meeting_id,
                          isHost: userdetails?.isHost,
                        },
                        CHIME_SOCKET_EVENTS.USER_LEFT_MEETING
                      );
                      window.close();
                    })
                    .catch(() => {
                      toast.error("Unable to end Meeting !");
                    });
                },
                onCancel() {},
              });
            }}
          >
            <span
              className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
            >
              logout
            </span>
            {/* <i className={`${styles.exit_icon} `}></i> */}
            Exit
          </div>
        </div>
        <div className={`${styles.endContainer} ${styles.onlyMob} onlyMob`}>
          <div
            className={styles.Actionsec}
            style={{
              color: getisActiveRaiseHand() ? "#F2718D" : "#ffffff",
            }}
            onClick={() => {
              if (getisActiveRaiseHand()) {
                ChimesendMessage(
                  {
                    user_id: userdetails?.id,
                    meetingId: EventData?.chime_meeting_id,
                    raise_hand: false,
                  },
                  CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                );
                setRaiseHandUsers((pre) =>
                  pre.filter((ele) => ele.id !== userdetails?.id)
                );
              } else {
                ChimesendMessage(
                  {
                    user_id: userdetails?.id,
                    meetingId: EventData?.chime_meeting_id,
                    raise_hand: true,
                  },
                  CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                );
                setRaiseHandUsers((pre) => [...pre, userdetails]);
              }
            }}
          >
            <i
              className={` ${
                getisActiveRaiseHand()
                  ? styles.raise_hand_active_icon
                  : styles.raise_hand_icon
              } ${styles.icon}`}
            ></i>
            Raise Hand
          </div>
          <div
            className={styles.Actionsec}
            onClick={() => {
              if (isChatorParticipant === "participant") {
                setisChatorParticipant(null);
              } else {
                setisChatorParticipant("participant");
              }
            }}
          >
            <Badge
              size="small"
              count={RequestRef.current?.length || 0}
              offset={[5, 0]}
            >
              <i className={`${styles.participant_icon} ${styles.icon}`}></i>
            </Badge>
            Participant
          </div>
          <Dropdown
            menu={{
              items: [
                // {
                //   label: (
                //     <div className={styles.dropdownSec}>
                //       <i
                //         className={`${styles.participant_icon} ${styles.icon}`}
                //         style={{
                //           background: "black",
                //         }}
                //       ></i>
                //       Participant
                //     </div>
                //   ),
                //   key: "0",
                // },
                {
                  label: (
                    <div
                      className={styles.dropdownSec}
                      onClick={() => {
                        if (isChatorParticipant === "chat") {
                          setisChatorParticipant(null);
                        } else {
                          setisChatorParticipant("chat");
                        }
                      }}
                    >
                      <i
                        className={`${styles.chat_icon} ${styles.icon}`}
                        style={{
                          background: "black",
                        }}
                      ></i>
                      Chat
                    </div>
                  ),
                  key: "1",
                },
                {
                  label: (
                    <div
                      className={styles.dropdownSec}
                      style={{
                        color: "red",
                      }}
                      onClick={() => {
                        confirm({
                          title: "Are you sure Do you want to Exit Meeting?",
                          icon: <ExclamationCircleFilled />,
                          onOk() {
                            handleExitMeeting(userdetails)
                              .then(() => {
                                ChimesendMessage(
                                  {
                                    name: userdetails?.name,
                                    userId: userdetails?.id,
                                    meetingId: EventData?.chime_meeting_id,
                                    isHost: userdetails?.isHost,
                                  },
                                  CHIME_SOCKET_EVENTS.USER_LEFT_MEETING
                                );
                                window.close();
                              })
                              .catch(() => {
                                toast.error("Unable to end Meeting !");
                              });
                          },
                          onCancel() {},
                        });
                      }}
                    >
                      <span
                        className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
                      >
                        logout
                      </span>
                      Exit
                    </div>
                  ),
                  key: "2",
                },
              ],
            }}
            trigger={["click"]}
          >
            <div className={styles.Actionsec}>
              <span class="material-symbols-outlined">more_horiz</span>
              More
            </div>
          </Dropdown>
        </div>
      </div>

      <MeetingManagerComponent setRaiseHandUsers={setRaiseHandUsers} />
    </div>
  );
};

export default EventLayout;
