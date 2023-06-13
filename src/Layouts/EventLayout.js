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
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { Dropdown } from "antd";

export function useEventLayout() {
  return useOutletContext();
}

const EventLayout = () => {
  const [isChatorParticipant, setisChatorParticipant] = useState(null);
  const [isPinEnabled, setisPinEnabled] = useState(false);
  const { muted, toggleMute } = useToggleLocalMute();
  const audiovideo = useAudioVideo();
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const { devices, selectedDevice } = useAudioOutputs();
  const audioinput = useAudioInputs();
  const videoinput = useVideoInputs();
  const { tileId, isVideoEnabled, hasReachedVideoLimit, toggleVideo } =
    useLocalVideo();

  const contectValues = {
    isPinEnabled,
    setisPinEnabled,
    isChatorParticipant,
    setisChatorParticipant,
  };

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

  const onSelect = (ele) => {
    console.log(ele);
  };

  return (
    <div>
      <div className={`${classes.topheader} ${classes.eventHeader}`}>
        <div className={classes.meetingHeader}>
          <img src={Rlogo} />
          <h2>Rawcaster Meeting</h2>
        </div>
      </div>
      <Outlet context={contectValues} />
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
                    onClick={() => {
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
                    <span class="material-symbols-outlined">expand_less</span>
                  </div>
                </Dropdown>
              </div>
              {muted ? <>UnMute</> : <>Mute</>}
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
                    onClick={() => {
                      toggleVideo();
                    }}
                  ></i>
                )}
                <Dropdown
                  menu={{
                    items: DeviceList(videoinput.devices, async (id) => {
                      audiovideo.startVideoInput(id);
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
                    <span class="material-symbols-outlined">expand_less</span>
                  </div>
                </Dropdown>
              </div>
              {isVideoEnabled ? <>Stop Video</> : <>Start Video</>}
            </div>
          </div>
        </div>
        <div style={{ width: "40%" }}>
          <div
            className={styles.Actionsec}
            style={{
              color: isLocalUserSharing ? "#F2718D" : "#FFFFFF",
            }}
            onClick={() => {
              toggleContentShare();
              // toggleContentShare().then((res) => {
              //   console.log(res, "===>res");
              // });
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
        <div className={styles.endContainer}>
          <div className={styles.Actionsec}>
            <i className={`${styles.present_icon} ${styles.icon}`}></i>
            Allow
          </div>
          <div
            className={styles.Actionsec}
            onClick={() => {
              setisPinEnabled(!isPinEnabled);
            }}
          >
            <i class="material-symbols-outlined">grid_view</i>
            View
          </div>
          <div className={styles.Actionsec}>
            <i className={`${styles.raise_hand_icon} ${styles.icon}`}></i>
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
            <i className={`${styles.participant_icon} ${styles.icon}`}></i>
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
      </div>
    </div>
  );
};

export default EventLayout;
