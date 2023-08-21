import React, { useState } from "react";
import styles from "./Menu.module.css";
import { Badge, Dropdown, Modal, Popover } from "antd";
import {
  useAudioInputs,
  useAudioOutputs,
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
import {
  HangupComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
} from "./Utility";
import MoreBottomSheet from "./MoreBottomSheet";

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
  const audiooutput = useAudioOutputs();
  const videoinput = useVideoInputs();
  const [AudioSelectedDevice, setAudioSelectedDevice] = useState<any>(null);
  const [selectedDevice, setselectedDevice] = useState<any>(null);
  const [isMore, setisMore] = useState<Boolean>(false);
  console.log(audiooutput.selectedDevice, "selectedDevice");

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
  console.log(audiooutput.selectedDevice, "selectedDevice");
  return (
    <div className={styles.BottomContainer}>
      <div className={styles.startContainer}>
        <div className="d-flex flex-row">
          <div className={styles.Actionsec}>
            <div className={styles.iconBox}>
              <LocalMicrophoneComponent />
              {/* <Dropdown
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
                > */}
              <Popover
                placement="top"
                showArrow={false}
                content={
                  <div className={styles.micdropDown}>
                    <h3>Microphone</h3>
                    {audioinput.devices.map((ele) => {
                      const getisActive = () =>
                        audioinput.selectedDevice === ele.deviceId;
                      return (
                        <span
                          onClick={() => {
                            console.log(audioinput.selectedDevice);

                            if (audiovideo) {
                              try {
                                setAudioSelectedDevice(ele.deviceId);
                                audiovideo.startAudioInput(ele.deviceId);
                              } catch (error) {
                                console.error(
                                  "Error setting speaker device:",
                                  error
                                );
                              }
                            }
                          }}
                        >
                          <i
                            className="material-symbols-outlined"
                            style={{
                              color: getisActive() ? "black" : "transparent",
                            }}
                          >
                            done
                          </i>
                          {ele.label}
                        </span>
                      );
                    })}
                    <h3>Speaker</h3>
                    {audiooutput.devices.map((ele) => {
                      const getisActive = () =>
                        audiooutput.selectedDevice === ele.deviceId;
                      return (
                        <span
                          onClick={() => {
                            if (audiovideo) {
                              try {
                                setAudioSelectedDevice(ele.deviceId);
                                audiovideo.chooseAudioOutput(ele.deviceId);
                              } catch (error) {
                                console.error(
                                  "Error setting speaker device:",
                                  error
                                );
                              }
                            }
                          }}
                        >
                          <i
                            className="material-symbols-outlined"
                            style={{
                              color: getisActive() ? "black" : "transparent",
                            }}
                          >
                            done
                          </i>

                          {ele.label}
                        </span>
                      );
                    })}
                  </div>
                }
                trigger="click"
              >
                <div
                  style={{
                    color: "white",
                  }}
                >
                  <span className="material-symbols-outlined onlydes">
                    expand_less
                  </span>
                </div>
              </Popover>
              {/* </Dropdown> */}
            </div>
            {muted ? <>Unmute</> : <>Mute</>}
          </div>
        </div>
        <div className="d-flex flex-row">
          <div className={styles.Actionsec}>
            <div className={`${styles.iconBox} ${styles.videoiconBox}`}>
              <LocalCameraComponent
                selectedDevice={selectedDevice}
                setselectedDevice={setselectedDevice}
              />
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
                    <span className="material-symbols-outlined onlydes">
                      expand_less
                    </span>
                  </div>
                </Dropdown>
              )}
            </div>
            {isVideoEnabled ? <>Disable</> : <>Enable</>}
          </div>
        </div>
        <div className="onlydes"></div>
        <div className="onlyMob">
          <HangupComponent userdetails={userdetails} />
        </div>

        <div className={`${styles.Actionsec} onlyMob`}>
          <div
            className={`${styles.iconBox} ${styles.onlyMob}`}
            onClick={() => {
              if (isChatorParticipant === "chat") {
                setisChatorParticipant(null);
              } else {
                setisChatorParticipant("chat");
              }
            }}
          >
            <i className={`${styles.chat_icon} ${styles.icon}`}></i>
          </div>
          Chat
        </div>
        <div
          className={`${styles.Actionsec} ${styles.onlyMob}`}
          onClick={() => {
            setisMore(true);
          }}
        >
          <div className={styles.iconBox}>
            <i className="material-symbols-outlined">more_horiz</i>
          </div>
          More
        </div>
      </div>
      <div style={{ width: "150%" }} className="onlydes">
        <div
          className={styles.Actionsec}
          style={{
            color: isLocalUserSharing ? "#F2718D" : "#FFFFFF",
            textAlign: "center",
            margin: "auto",
          }}
          onClick={() => {
            toggleContentShare();
          }}
        >
          <div className={styles.iconBox}>
            <i
              className={`${styles.present_icon} ${styles.icon}`}
              style={{
                background: isLocalUserSharing ? "#F2718D" : "#FFFFFF",
              }}
            ></i>
          </div>
          Present
        </div>
      </div>
      <div className={`${styles.endContainer} ${styles.onlydes} onlydes`}>
        {userdetails?.isHost && (
          <div className={styles.Actionsec}>
            <div className={styles.iconBox}>
              <i className={`${styles.present_icon} ${styles.icon}`}></i>
            </div>
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
            <div className={styles.iconBox}>
              <i className="material-symbols-outlined">grid_view</i>
            </div>
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
                  user_id: userdetails?.userId,
                  refId: EventData?.reference_id,
                  raise_hand: false,
                },
                CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
              );
              setRaiseHandUsers((pre) =>
                pre.filter((ele) => ele.userId !== userdetails?.userId)
              );
            } else {
              ChimesendMessage(
                {
                  user_id: userdetails?.userId,
                  refId: EventData?.reference_id,
                  raise_hand: true,
                },
                CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
              );
              setRaiseHandUsers((pre) => [...pre, userdetails]);
            }
          }}
        >
          <div className={styles.iconBox}>
            <i
              className={` ${
                getisActiveRaiseHand()
                  ? styles.raise_hand_active_icon
                  : styles.raise_hand_icon
              } ${styles.icon}`}
            ></i>
          </div>
          Raise Hand
        </div>

        <div
          className={`${styles.Actionsec} ${styles.participantAction}`}
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
            <div className={styles.iconBox}>
              <i className={`${styles.participant_icon} ${styles.icon}`}></i>
            </div>
          </Badge>
          Participant
        </div>

        <div
          className={`${styles.Actionsec} ${styles.eventActionsec} ${styles.ChatIconsec}`}
          onClick={() => {
            if (isChatorParticipant === "chat") {
              setisChatorParticipant(null);
            } else {
              setisChatorParticipant("chat");
            }
          }}
        >
          <div className={styles.iconBox}>
            <i className={`${styles.chat_icon} ${styles.icon}`}></i>
          </div>
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
                        userId: userdetails?.userId,
                        refId: EventData?.reference_id,
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
          <div className={styles.iconBox}>
            <span
              className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
            >
              logout
            </span>
          </div>
          {/* <i className={`${styles.exit_icon} `}></i> */}
          Exit
        </div>
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
                          user_id: userdetails?.userId,
                          refId: EventData?.reference_id,
                          raise_hand: false,
                        },
                        CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                      );
                      setRaiseHandUsers((pre: any) =>
                        pre.filter(
                          (ele: any) => ele.userId !== userdetails?.userId
                        )
                      );
                    } else {
                      ChimesendMessage(
                        {
                          user_id: userdetails?.userId,
                          refId: EventData?.reference_id,
                          raise_hand: true,
                        },
                        CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                      );
                      setRaiseHandUsers((pre: any) => [...pre, userdetails]);
                    }
                  }}
                >
                  <i
                    className={` ${styles.raise_hand_icon} ${styles.icon} `}
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
  );
};

export default EventMenu;
