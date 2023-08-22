import React, { useState } from "react";
import styles from "./Menu.module.css";
import {
  useAudioInputs,
  useAudioVideo,
  useLocalVideo,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { useEventLayout } from "../Room/EventValidaton";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { Badge, Dropdown, Modal } from "antd";
import MoreBottomSheet from "./MoreBottomSheet";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { LocalCameraComponent, LocalMicrophoneComponent } from "./Utility";

const TalkshowMenu = ({
  RaiseHandUsers,
  setRaiseHandUsers,
  userdetails,
  isReactions,
  setisReactions,
  isNewMessage,
  setisNewMessage,
}) => {
  const {
    isChatorParticipant,
    setisChatorParticipant,
    EventData,
    handleExitMeeting,
  }: any = useEventLayout();
  const { isVideoEnabled } = useLocalVideo();
  const { muted } = useToggleLocalMute();
  const audiovideo = useAudioVideo();
  const audioinput = useAudioInputs();
  const videoinput = useVideoInputs();
  const [isMore, setisMore] = useState<Boolean>(false);
  const [selectedDevice, setselectedDevice] = useState<any>(null);

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
    <div className={`${styles.BottomContainer} ${styles.TalkshowMenu}`}>
      <div className={styles.menuContainer}>
        <div
          className={`${styles.iconContainer} ${styles.switchIconSec} ${
            !muted ? styles.activeiconContainer : ""
          }`}
        >
          <LocalMicrophoneComponent />

          <Dropdown
            menu={{
              selectable: true,

              items: DeviceList(audioinput.devices, async (id: any) => {
                audiovideo?.startAudioInput(id);
              }),
            }}
            placement="top"
            trigger={["click"]}
          >
            <span className="material-symbols-outlined onlydes">
              expand_less
            </span>
          </Dropdown>
        </div>
        <div
          className={`${styles.iconContainer} ${styles.switchIconSec} ${
            styles.videoIconSec
          } ${isVideoEnabled ? styles.activeiconContainer : ""}`}
        >
          <LocalCameraComponent
            selectedDevice={selectedDevice}
            setselectedDevice={setselectedDevice}
          />
          <Dropdown
            menu={{
              selectable: true,
              items: DeviceList(videoinput.devices, async (id: any) => {
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
            trigger={["click"]}
          >
            <span className="material-symbols-outlined onlydes">
              expand_less
            </span>
          </Dropdown>
        </div>
        {userdetails?.isHost ? (
          <div
            className={`onlydes ${styles.streamBtn}`}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure Do you want to Stop Talkshow Streaming ? ",
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
                      toast.error("Unable to end Talkshow !");
                    });
                },
                onCancel() {},
              });
            }}
          >
            <span className={`material-symbols-outlined `}>
              radio_button_checked
            </span>
            Stop Straming
          </div>
        ) : (
          <div
            className={`${styles.iconContainer} ${styles.EndIcon} onlydes`}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure Do you want to Exit Talkshow Streaming ?",
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
                      toast.error("Unable to end Talkshow !");
                    });
                },
                onCancel() {},
              });
            }}
          >
            <i className={`${styles.hang_up_icon} ${styles.icon}`}></i>
          </div>
        )}
        <div
          className={`${styles.iconContainer} ${
            isReactions ? styles.activeiconContainer : ""
          }`}
          onClick={() => {
            setisReactions((pre: Boolean) => !pre);
          }}
        >
          <i className="material-symbols-outlined">mood</i>
        </div>
        <div
          className={`${styles.iconContainer} onlydes ${
            getisActiveRaiseHand() ? styles.activeiconContainer : ""
          }`}
          onClick={() => {
            if (getisActiveRaiseHand()) {
              ChimesendMessage(
                {
                  refId: EventData?.reference_id,
                },
                CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
              );
              setRaiseHandUsers((pre: any) =>
                pre.filter((ele: any) => ele.id !== userdetails?.id)
              );
            } else {
              ChimesendMessage(
                {
                  refId: EventData?.reference_id,
                },
                CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
              );
              setRaiseHandUsers((pre: any) => [...pre, userdetails]);
            }
          }}
        >
          <i
            className={` ${
              styles.raise_hand_icon
              // getisActiveRaiseHand()
              //   // ? styles.raise_hand_active_icon
              //   : styles.raise_hand_icon
            } ${styles.icon} `}
          ></i>
        </div>
        <Badge dot={isNewMessage === "participant"}>
          <div
            className={`${styles.iconContainer} onlydes ${
              isChatorParticipant === "participant"
                ? styles.activeiconContainer
                : ""
            }`}
            onClick={() => {
              if (isChatorParticipant === "participant") {
                setisChatorParticipant(null);
              } else {
                setisChatorParticipant("participant");
              }
            }}
          >
            <i className={`${styles.participant_icon} ${styles.icon}`}></i>
          </div>
        </Badge>

        <div
          className={`${styles.iconContainer} onlydes  ${
            isChatorParticipant === "comment" ? styles.activeiconContainer : ""
          }`}
          onClick={() => {
            setisNewMessage(false);
            if (isChatorParticipant === "comment") {
              setisChatorParticipant(null);
            } else {
              setisChatorParticipant("comment");
            }
          }}
        >
          <Badge dot={isNewMessage === "comment"}>
            <i className={`${styles.chat_icon} ${styles.icon}`}></i>
          </Badge>
        </div>

        <div
          className={`${styles.iconContainer} onlyMob`}
          onClick={() => {
            setisMore((pre) => !pre);
          }}
        >
          <i className="material-symbols-outlined">more_vert</i>
        </div>

        <div
          className={`${styles.iconContainer} ${styles.EndIcon} onlyMob`}
          onClick={() => {
            Modal.confirm({
              title: "Are you sure Do you want to Exit Talkshow Streaming ?",
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
                    toast.error("Unable to end Talkshow !");
                  });
              },
              onCancel() {},
            });
          }}
        >
          <i className={`${styles.hang_up_icon} ${styles.icon}`}></i>
        </div>
        <div className="onlyMob">
          <MoreBottomSheet
            open={isMore}
            onClose={() => {
              setisMore(false);
            }}
          >
            <>
              <div className={styles.MoreBottomSheetSec}>
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer}  ${
                      getisActiveRaiseHand() ? styles.activeiconContainer : ""
                    }`}
                    onClick={() => {
                      if (getisActiveRaiseHand()) {
                        ChimesendMessage(
                          {
                            refId: EventData?.reference_id,
                          },
                          CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                        );
                        setRaiseHandUsers((pre: any) =>
                          pre.filter((ele: any) => ele.id !== userdetails?.id)
                        );
                      } else {
                        ChimesendMessage(
                          {
                            refId: EventData?.reference_id,
                          },
                          CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                        );
                        setRaiseHandUsers((pre: any) => [...pre, userdetails]);
                      }
                    }}
                  >
                    <i
                      className={` ${
                        styles.raise_hand_icon
                        // getisActiveRaiseHand()
                        //   // ? styles.raise_hand_active_icon
                        //   : styles.raise_hand_icon
                      } ${styles.icon} `}
                    ></i>
                  </div>
                  <p>Raise Hand</p>
                </div>
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer}`}
                    onClick={() => {
                      setisMore((pre) => !pre);
                      if (isChatorParticipant === "participant") {
                        setisChatorParticipant(null);
                      } else {
                        setisChatorParticipant("participant");
                      }
                    }}
                  >
                    <i
                      className={`${styles.participant_icon} ${styles.icon}`}
                    ></i>
                  </div>
                  <p>Participants</p>
                </div>
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer}`}
                    onClick={() => {
                      setisMore((pre) => !pre);
                      if (isChatorParticipant === "comment") {
                        setisChatorParticipant(null);
                      } else {
                        setisChatorParticipant("comment");
                      }
                    }}
                  >
                    <i className={`${styles.chat_icon} ${styles.icon}`}></i>
                  </div>
                  <p>Comments</p>
                </div>
              </div>
              <div className={styles.MoreBottomSheetSec}>
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer}`}
                    onClick={async () => {
                      setisMore((pre) => !pre);
                      const getDeviceId = () => {
                        if (selectedDevice) {
                          return selectedDevice?.deviceId;
                        }
                        return videoinput.selectedDevice;
                      };
                      const findValue: any = videoinput.devices.find(
                        (ele) => ele.deviceId !== getDeviceId()
                      );
                      setselectedDevice(findValue);
                      if (findValue) {
                        await audiovideo?.startVideoInput(findValue.deviceId);
                        // toggleVideo();
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">
                      cameraswitch
                    </span>
                  </div>
                  <p>Switch Camera</p>
                </div>
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer}`}
                    onClick={() => {
                      setisMore((pre) => !pre);
                      if (isChatorParticipant === "comment") {
                        setisChatorParticipant(null);
                      } else {
                        setisChatorParticipant("comment");
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">volume_up</span>
                  </div>
                  <p>Switch Audio</p>
                </div>
              </div>
            </>
          </MoreBottomSheet>
        </div>
      </div>
    </div>
  );
};

export default TalkshowMenu;
