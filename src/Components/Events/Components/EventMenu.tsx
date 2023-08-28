import React, { useState } from "react";
import styles from "./Menu.module.css";
import { Badge, Drawer, Dropdown, Modal, Popover, message } from "antd";
import {
  useAudioInputs,
  useAudioOutputs,
  useAudioVideo,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useMeetingManager,
  useRosterState,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { useEventLayout } from "../Room/EventValidaton";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import {
  HangupComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
} from "./Utility";
import MoreBottomSheet from "./MoreBottomSheet";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { EndMeeting, ExitMeeting, MicOptions } from "./Methods";

const EventMenu = () => {
  const {
    isChatorParticipant,
    setisChatorParticipant,
    isPinEnabled,
    setisPinEnabled,
    EventData,
    RequestRef,
    handleExitMeeting,
    MeetingSettings,
    userdata,
    setMeetingSettings,
  }: any = useEventLayout();
  const userData = useAuthData();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const [messageApi, contextHolder] = message.useMessage();
  const audiovideo = useAudioVideo();
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const { isVideoEnabled } = useLocalVideo();
  const { muted } = useToggleLocalMute();
  const videoinput = useVideoInputs();
  const [selectedDevice, setselectedDevice] = useState<any>(null);
  const [isMore, setisMore] = useState<Boolean>(false);
  const [isSpeakerOpen, setisSpeakerOpen] = useState<boolean>(false);
  const meetingmanager = useMeetingManager();

  const enabledSettings = () => ({
    presentEnable: userdata?.screenShare === 1 || userdata?.isHost,
    allowEnable: userdata?.isHost,
    allowActive: MeetingSettings?.user_screenshare === 1,
    viewEnable: userdata?.isHost,
    localvideoStatus: userdata?.isHost || !userdata?.videoDisabledByHost,
    localMicStatus: userdata?.isHost || !userdata?.audioDisabledByHost,
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
                  hostId: userData?.user_id,
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
        {userdata?.isHost && (
          <div
            className={styles.Actionsec}
            onClick={() => {
              if (attendees.length >= 10) {
                setisPinEnabled(!isPinEnabled);
                ChimesendMessage(
                  {
                    refId: EventData?.reference_id,
                    view_type: isPinEnabled ? 1 : 2,
                    spotlight_id: userData?.user_id,
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
                userId: userData?.user_id,
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
        <div
          className={styles.Actionsec}
          style={{
            color: "red",
          }}
          onClick={() => {
            if (userdata?.isHost) {
              EndMeeting({
                Attendee: userdata,
                EventData,
                handleExitMeeting,
              });
            } else {
              ExitMeeting({
                Attendee: userdata,
                EventData,
                handleExitMeeting,
              });
            }
          }}
        >
          <div className={styles.iconBox}>
            <span
              className={`material-symbols-outlined ${styles.icon} ${styles.spanicon}`}
            >
              logout
            </span>
          </div>
          {userdata?.isHost ? "End" : "Leave"}
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
                    userdata?.handRaised ? styles.activeiconContainer : ""
                  }`}
                  onClick={() => {
                    ChimesendMessage(
                      {
                        refId: EventData?.reference_id,
                        userId: userData?.user_id,
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
                          hostId: userData?.user_id,
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
              {userdata?.isHost && (
                <div className={styles.iconSec}>
                  <div
                    className={`${styles.iconContainer} ${
                      isPinEnabled ? styles.activeiconContainer : ""
                    }`}
                    onClick={async () => {
                      if (attendees.length >= 10) {
                        setisPinEnabled(!isPinEnabled);
                        ChimesendMessage(
                          {
                            refId: EventData?.reference_id,
                            view_type: isPinEnabled ? 1 : 2,
                            spotlight_id: userData?.user_id,
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
