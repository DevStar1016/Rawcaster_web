import { useState } from "react";
import styles from "./Menu.module.css";
import {
  useAudioVideo,
  useLocalVideo,
  useMeetingManager,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { Badge, Modal, Popover } from "antd";
import MoreBottomSheet from "./MoreBottomSheet";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { LocalCameraComponent, LocalMicrophoneComponent } from "./Utility";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { EndMeeting, MicOptions } from "./Methods";
import { EventContextProp } from "./types";
import { useEventRoomContext } from "../../../Shared/Context";

const TalkshowMenu = ({ isNewMessage, setisNewMessage }) => {
  const {
    isChatorParticipant,
    setisChatorParticipant,
    EventData,
    handleExitMeeting,
    handleEndMeeting,
    userdata,
    isReactions,
    setisReactions,
    MeetingSettings
  }: EventContextProp = useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const { isVideoEnabled } = useLocalVideo();
  const { muted } = useToggleLocalMute();
  const audiovideo = useAudioVideo();
  const videoinput = useVideoInputs();
  const [isMore, setisMore] = useState<Boolean>(false);
  const [selectedDevice, setselectedDevice] = useState<any>(null);
  const meetingmanager = useMeetingManager();

  /**
   * Retrieves the user data. If the userData variable is defined, it returns the value of userData.
   * Otherwise, it returns the value of tempuserData.
   * @returns The user data.
   */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  const enabledSettings = () => ({
    isHost: userdata?.isHost,
    localMicStatus: (userdata?.isHost || userdata?.isCoHost ) ? true : false,
    localvideoStatus: (userdata?.isHost || userdata?.isCoHost ) ? true : false,
  });

  return (
    <div className={`${styles.BottomContainer} ${styles.TalkshowMenu}`}>
      <div className={styles.menuContainer}>
      {!userdata?.audioDisabledByHost && <div
          className={`${styles.iconContainer} ${styles.switchIconSec} ${
            !muted ? styles.activeiconContainer : ""
          }`}
        >
          <LocalMicrophoneComponent
            isAllowed={enabledSettings().localMicStatus}
          />

          <Popover
            placement="top"
            showArrow={false}
            content={<MicOptions />}
            trigger="click"
          >
            <span className="material-symbols-outlined onlydes">
              expand_less
            </span>
          </Popover>
        </div>}
        {(userdata?.isHost || userdata?.isCoHost) && (
          <div
            className={`${styles.iconContainer} ${styles.switchIconSec} ${
              styles.videoIconSec
            } ${isVideoEnabled ? styles.activeiconContainer : ""}`}
          >
            <LocalCameraComponent
              selectedDevice={selectedDevice}
              setselectedDevice={setselectedDevice}
              isAllowed={enabledSettings().localvideoStatus}
            />
            {videoinput.devices.length !== 0 && (
              <Popover
                placement="top"
                showArrow={false}
                content={
                  <div className={styles.micdropDown}>
                    {videoinput.devices.map((ele) => {
                      const getisActive = () =>
                        videoinput.selectedDevice === ele.deviceId;
                      return (
                        <span
                          onClick={async () => {
                            if (audiovideo) {
                              try {
                                await meetingmanager.startVideoInputDevice(
                                  ele.deviceId
                                );
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
            )}
          </div>
        )}
        {userdata?.isHost ? (
          <div
            className={`onlydes ${styles.streamBtn}`}
            onClick={() =>
              EndMeeting({
                modalTitle: "Are you sure you want to end this Talkshow event?",
                Attendee: userdata,
                EventData,
                handleEndMeeting,
                meetingmanager,
              })
            }
          >
            <span className={`material-symbols-outlined `}>
              radio_button_checked
            </span>
            Stop Streaming
          </div>
        ) : (
          <div
            className={`${styles.iconContainer} ${styles.EndIcon} onlydes`}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to leave this Talkshow event?",
                icon: <ExclamationCircleFilled />,
                onOk() {
                  handleExitMeeting(userdata)
                    .then(() => {
                      ChimesendMessage(
                        {
                          name: userdata?.name,
                          userId: userdata?.userId,
                          meetingId: EventData?.chime_meeting_id,
                          isHost: userdata?.isHost,
                        },
                        CHIME_SOCKET_EVENTS.USER_LEFT_MEETING
                      );
                      window.close();
                    })
                    .catch(() => {
                      toast.remove("Error");
                      toast.error("Unable to end Talkshow !", {
                        id: "Error",
                      });
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
            setisReactions((pre) => !pre);
          }}
        >
          <i className="material-symbols-outlined">mood</i>
        </div>
        <div
          className={`${styles.iconContainer} onlydes ${
            userdata?.handRaised ? styles.activeiconContainer : ""
          }`}
          onClick={() => {
            ChimesendMessage(
              {
                refId: EventData?.reference_id,
                userId: getUserData()?.user_id,
                status: !userdata?.handRaised,
              },
              CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
            );
          }}
        >
          <i className={` ${styles.raise_hand_icon} ${styles.icon} `}></i>
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
              title: "Are you sure you want to leave this Talkshow event?",
              icon: <ExclamationCircleFilled />,
              onOk() {
                handleExitMeeting(userdata)
                  .then(() => {
                    ChimesendMessage(
                      {
                        name: userdata?.name,
                        userId: userdata?.userId,
                        meetingId: EventData?.chime_meeting_id,
                        isHost: userdata?.isHost,
                      },
                      CHIME_SOCKET_EVENTS.USER_LEFT_MEETING
                    );
                    window.close();
                  })
                  .catch(() => {
                    toast.remove("Error");
                    toast.error("Unable to exit Talkshow !", {
                      id: "Error",
                    });
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
                      userdata?.handRaised ? styles.activeiconContainer : ""
                    }`}
                    onClick={() => {
                      ChimesendMessage(
                        {
                          refId: EventData?.reference_id,
                          userId: getUserData()?.user_id,
                          status: !userdata?.handRaised,
                        },
                        CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
                      );
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
