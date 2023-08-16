import React from "react";
import styles from "./Menu.module.css";
import { Badge, Dropdown, Modal } from "antd";
import {
  useAudioInputs,
  useAudioVideo,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { useEventLayout } from "../Room/EventValidaton";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { toast } from "react-hot-toast";

const EventMenu = ({ userdetails, RaiseHandUsers, setRaiseHandUsers }) => {
  const {
    isChatorParticipant,
    setisChatorParticipant,
    isPinEnabled,
    setisPinEnabled,
    EventData,
    RequestRef,
    handleExitMeeting,
  }: any = useEventLayout();
  const audiovideo = useAudioVideo();
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const { confirm } = Modal;
  const { isVideoEnabled, toggleVideo, setIsVideoEnabled } = useLocalVideo();
  const { muted, toggleMute } = useToggleLocalMute();
  const audioinput = useAudioInputs();
  const videoinput = useVideoInputs();

  const DeviceList = (List: any, onSelect: any) => {
    return List.map((ele: any, index: any) => {
      return {
        key: index + 1,
        label: (
          <div
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

  const getisActiveRaiseHand = () => {
    const findData = RaiseHandUsers.find(
      (ele: any) => ele.id === userdetails?.id
    );
    return findData;
  };

  return (
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
                    toggleMute();
                  }}
                ></i>
              )}
              <Dropdown
                menu={{
                  items: DeviceList(audioinput.devices, async (id) => {
                    audiovideo?.startAudioInput(id);
                  }),
                }}
                placement="top"
              >
                <div
                  style={{
                    color: "white",
                  }}
                >
                  <span className="material-symbols-outlined">expand_less</span>
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
                      await audiovideo?.startVideoInput(videoinput.devices[0]);
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
                        ?.startVideoInput(id)
                        .then((res: any) => {
                          console.log(res);
                        })
                        .catch((err: any) => {
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
            <span className="material-symbols-outlined">more_horiz</span>
            More
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default EventMenu;
