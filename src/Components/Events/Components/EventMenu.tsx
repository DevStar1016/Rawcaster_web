import { useState } from "react";
import styles from "./Menu.module.css";
import { Badge, Popover, message } from "antd";
import {
  useAudioVideo,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useMeetingManager,
  useRosterState,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import {
  HangupComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
} from "./Utility";
import MoreBottomSheet from "./MoreBottomSheet";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { ExitMeeting, HostExitOption, MicOptions } from "./Methods";
import { EventContextProp, MeetingSettingProp } from "./types";
import { useEventRoomContext } from "../../../Shared/Context";

const EventMenu = () => {
  const {
    isChatorParticipant,
    setisChatorParticipant,
    isPinEnabled,
    EventData,
    RequestRef,
    handleExitMeeting,
    MeetingSettings,
    userdata,
    setMeetingSettings,
  }: EventContextProp = useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const [messageApi, contextHolder] = message.useMessage();
  const audiovideo = useAudioVideo();
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const { isVideoEnabled } = useLocalVideo();
  const { muted } = useToggleLocalMute();
  const videoinput = useVideoInputs();
  const meetingmanager = useMeetingManager();
  const [selectedDevice, setselectedDevice] = useState<any>(null);
  const [isMore, setisMore] = useState<Boolean>(false);
  const [isSpeakerOpen, setisSpeakerOpen] = useState<boolean>(false);

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

  /* Default Menu Enable/Disable Handling */
  /**
   * Returns an object containing various enabled settings based on the user data and meeting settings.
   * @returns {Object} - An object with the following properties:
   *   - isHost: A boolean indicating if the user is a host.
   *   - presentEnable: A boolean indicating if the user can enable screen sharing or if they are a host.
   *   - allowEnable: A boolean indicating if the user is a host.
   *   - allowActive: A boolean indicating if screen sharing is allowed in the meeting settings.
   *   - viewEnable: A boolean indicating if the user is a host.
   *   - localvideoStatus: A boolean indicating if the user is a host or if their video is not disabled by the host.
   *
   */
  const enabledSettings = () => ({
    isHost: userdata?.isHost,
    isCoHost: userdata?.isCoHost,
    presentEnable: userdata?.screenShare || userdata?.isHost || userdata?.isCoHost,
    allowEnable: userdata?.isHost || userdata?.isCoHost,
    allowActive: MeetingSettings?.user_screenshare === 1,
    viewEnable: userdata?.isHost|| userdata?.isCoHost,
    localvideoStatus: (userdata?.isHost || userdata?.isCoHost) ? true : MeetingSettings?.default_guest_video === 0 ? false : true,
    localMicStatus: (userdata?.isHost || userdata?.isCoHost) ? true : MeetingSettings?.default_guest_audio === 0 ? false : true,
  });

  return (
    <div className={styles.BottomContainer}>
      {contextHolder}
      <div className={styles.startContainer}>
        <div className="d-flex flex-row">
          <div className={styles.Actionsec}>
            <div className={styles.iconBox}>
              <LocalMicrophoneComponent
                isAllowed={enabledSettings().localMicStatus}
              />

              <Popover
                placement="top"
                showArrow={false}
                content={<MicOptions />}
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
                isAllowed={enabledSettings().localvideoStatus}
                setselectedDevice={setselectedDevice}
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
            {isVideoEnabled ? <>Disable</> : <>Enable</>}
          </div>
        </div>
        <div className="onlydes"></div>
        <div className="onlyMob">
          <HangupComponent />
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
            color: enabledSettings().presentEnable
              ? isLocalUserSharing
                ? "#F2718D"
                : "#FFFFFF"
              : "gray",
            textAlign: "center",
            margin: "auto",
          }}
          onClick={() => {
            if (enabledSettings().presentEnable) {
              toggleContentShare();
            } else {
              messageApi.open({
                type: "warning",
                content: "Present Disabled By Host",
              });
            }
          }}
        >
          <div className={styles.iconBox}>
            <i
              className={`${styles.present_icon} ${styles.icon} ${
                enabledSettings().presentEnable ? "" : styles.disableIcon
              }`}
              style={{
                background: isLocalUserSharing ? "#F2718D" : "#FFFFFF",
              }}
            ></i>
          </div>
          Present
        </div>
      </div>
      <div className={`${styles.endContainer} ${styles.onlydes} onlydes`}>
        {enabledSettings().allowEnable && (
          <div
            className={styles.Actionsec}
            style={{
              color: enabledSettings().allowActive ? "#F2718D" : "#ffffff",
            }}
            onClick={() => {
              ChimesendMessage(
                {
                  refId: EventData?.reference_id,
                  hostId: getUserData()?.user_id,
                  status: enabledSettings().allowActive ? false : true,
                },
                CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN
              );
              setMeetingSettings((prev: MeetingSettingProp) => {
                return {
                  ...prev,
                  user_screenshare: enabledSettings().allowActive ? 0 : 1,
                };
              });
            }}
          >
            <div className={styles.iconBox}>
              <i
                className={`${styles.present_icon} ${styles.icon} ${
                  enabledSettings().allowActive ? styles.activeicon : ""
                }`}
              ></i>
            </div>
            {enabledSettings().allowActive ? "Disable" : "Allow"}
          </div>
        )}
        {enabledSettings()?.isHost || enabledSettings()?.isCoHost && (
          <div
            className={styles.Actionsec}
            onClick={() => {
              if (attendees.length >= 0) {
                ChimesendMessage(
                  {
                    refId: EventData?.reference_id,
                    pin_enabled: isPinEnabled ? 0 : 1,
                    pinned_user_id: getUserData()?.user_id,
                  },
                  CHIME_SOCKET_EVENTS.UPDATE_LAYOUT
                );
              } else {
                messageApi.open({
                  type: "warning",
                  content: "Need more participants to switch view",
                });
              }
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
            color: userdata?.handRaised ? "#F2718D" : "#ffffff",
          }}
          onClick={() => {
            ChimesendMessage(
              {
                refId: EventData?.reference_id,
                userId: getUserData()?.user_id,
                status: !userdata.handRaised,
              },
              CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND
            );
          }}
        >
          <div className={styles.iconBox}>
            <i
              className={` ${
                userdata?.handRaised
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
        {enabledSettings()?.isHost || enabledSettings()?.isCoHost  ? (
          <Popover
            color='#563662'
            placement="topLeft"
            showArrow={false}
            content={<HostExitOption />}
            trigger="click"
          >
            <div
              className={styles.Actionsec}
            >
              <div className={styles.iconBox}>
                <span
                  className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
                >
                  logout
                </span>
              </div>
              {"Leave"}
            </div>
          </Popover>
        ) : (
          <div
            className={styles.Actionsec}
            onClick={() => {
              ExitMeeting({
                Attendee: userdata,
                EventData,
                handleExitMeeting,
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
            {"Leave"}
          </div>
        )}
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
                        status: !userdata.handRaised,
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
              {enabledSettings().allowEnable && (
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer} ${
                      enabledSettings().allowActive
                        ? styles.activeiconContainer
                        : ""
                    }`}
                    onClick={() => {
                      ChimesendMessage(
                        {
                          refId: EventData?.reference_id,
                          hostId: getUserData()?.user_id,
                          status: enabledSettings().allowActive ? false : true,
                        },
                        CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN
                      );
                      setMeetingSettings((pre: any) => ({
                        ...pre,
                        user_screenshare: enabledSettings().allowActive ? 0 : 1,
                      }));
                    }}
                  >
                    <i className={`${styles.present_icon} ${styles.icon}`}></i>
                  </div>
                  <p> {enabledSettings().allowActive ? "Disable" : "Allow"}</p>
                </div>
              )}
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
              {enabledSettings()?.isHost && enabledSettings()?.isCoHost && (
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer} ${
                      isPinEnabled ? styles.activeiconContainer : ""
                    }`}
                    onClick={async () => {
                      if (attendees.length >= 10) {
                        ChimesendMessage(
                          {
                            refId: EventData?.reference_id,

                            pin_enabled: isPinEnabled ? 0 : 1,
                            pinned_user_id: getUserData()?.user_id,
                          },
                          CHIME_SOCKET_EVENTS.UPDATE_LAYOUT
                        );
                      } else {
                        messageApi.open({
                          type: "warning",
                          content: "Need more participants to switch view",
                        });
                      }
                    }}
                  >
                    <i className="material-symbols-outlined">grid_view</i>
                  </div>
                  <p>View</p>
                </div>
              )}
              <div className={styles.iconSec}>
                <div
                  className={`${styles.iconContainer}`}
                  onClick={() => {
                    setisMore((pre) => !pre);
                    setisSpeakerOpen((pre) => !pre);
                  }}
                >
                  <span className="material-symbols-outlined">volume_up</span>
                </div>
                <p>Switch Audio</p>
              </div>
            </div>
          </>
        </MoreBottomSheet>
        {/* <Drawer
          placement="bottom"
          open={isSpeakerOpen}
          closable={false}
          onClose={() => {
            setisSpeakerOpen(false);
          }}
          style={{
            padding: 0,
          }}
        > */}
        <MoreBottomSheet
          open={isSpeakerOpen}
          onClose={() => {
            setisSpeakerOpen(false);
          }}
        >
          <MicOptions TextColor={"#FFFFFF"} />
        </MoreBottomSheet>

        {/* </Drawer> */}
      </div>
    </div>
  );
};

export default EventMenu;
