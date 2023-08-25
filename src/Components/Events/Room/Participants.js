import { useEffect, useRef, useState } from "react";
import classes from "./Room.module.css";
import { Dropdown, Layout, Modal, Slider } from "antd";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import {
  AudioOutputControl,
  MicSelection,
  useAudioVideo,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { Collapse, Form, InputGroup } from "react-bootstrap";
import {
  CameraComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
  MicrophoneComponent,
  VolumeStatusComponent,
} from "../Components/Utility";
import RenameModal from "../Components/RenameModal";
import { toast } from "react-hot-toast";

const { Header, Footer, Content } = Layout;

const Participants = () => {
  const [isSearchEnable, setisSearchEnable] = useState(false);
  const [SpeakerState, setSpeakerState] = useState(false);
  const [renameAttendee, setrenameAttendee] = useState(false);
  const [SearchData, setSearchData] = useState("");
  const [audioElements, setAudioElements] = useState({});
  const {
    setisChatorParticipant,
    setRequestList,
    RequestRef,
    isHost,
    attendeesList,
    EventData,
  } = useLayoutContect();
  const userdata = useAuthData();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const audioVideo = useAudioVideo();

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
  };

  const handleAccept = (ele) => {
    ChimesendMessage(
      { ...ele, refId: EventData?.reference_id },
      CHIME_SOCKET_EVENTS.ALLOW_TO_JOIN_MEETING
    );
    setRequestList((pre) => pre.filter((elem) => elem.userId !== ele.userId));
    RequestRef.current = RequestRef.current.filter(
      (elem) => elem.userId !== ele.userId
    );
  };

  useEffect(() => {
    // Initialize Chime session and audio elements

    if (audioVideo) {
      audioVideo.addObserver({
        audioVideoDidStart: (meetingSession) => {
          // When attendee audio starts, create an audio element
          meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(
            (attendeeId, present, externalUserId) => {
              if (present) {
                const audioElement = new Audio();
                setAudioElements((prevAudioElements) => ({
                  ...prevAudioElements,
                  [attendeeId]: audioElement,
                }));
              }
            }
          );
        },
      });
    }
  }, [audioVideo]);

  const handleReject = (ele) => {
    const value = { userId: ele.userId };
    ChimesendMessage(value, CHIME_SOCKET_EVENTS.REJECT_TO_JOIN_MEETING);
    setRequestList((pre) => pre.filter((elem) => elem.userId !== ele.userId));
    RequestRef.current = RequestRef.current.filter(
      (elem) => elem.userId !== ele.userId
    );
  };

  const AttendeeComponent = ({ ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => parseInt(elem.userId) === parseInt(ele.externalUserId)
    );

    const isYou = parseInt(userdata.user_id) === parseInt(findAttendee.userId);

    return (
      <>
        <div
          className={classes.participantContainer}
          style={{
            display: findAttendee.name
              ?.toLowerCase()
              .includes(SearchData?.toLowerCase())
              ? ""
              : "none",
          }}
        >
          <div className={classes.itemName}>
            <img
              src={findAttendee.image ? findAttendee.image : ""}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = defaultprofileImg;
              }}
            />
            {findAttendee.name + `${isYou ? " (You)" : ""}`}
          </div>
          <div className={classes.itemAction}>
            {findAttendee.handRaised && (
              <span className={styles.raise_hand_active_icon_sm} />
            )}
            {findAttendee.isHost ? (
              <div className={classes.hostIcon}>HOST</div>
            ) : null}
            {!isYou && (
              <VolumeStatusComponent
                ele={ele}
                className={classes.speakersmallIcon}
                onClick={() => {
                  if (SpeakerState !== findAttendee.userId) {
                    setSpeakerState(findAttendee.userId);
                  } else {
                    setSpeakerState(false);
                  }
                }}
              />
            )}
            {isYou ? (
              <LocalMicrophoneComponent
                ref={null}
                className={classes.micsmallIcon}
              />
            ) : (
              <MicrophoneComponent
                ele={ele}
                attendee={findAttendee}
                isHost={isHost}
                className={classes.micsmallIcon}
              />
            )}

            {isYou ? (
              <LocalCameraComponent
                ref={null}
                setselectedDevice={null}
                selectedDevice={null}
                className={classes.videosmallIcon}
              />
            ) : (
              <CameraComponent
                ele={ele}
                attendee={findAttendee}
                isHost={isHost}
                className={classes.videosmallIcon}
              />
            )}
            {!isYou && isHost ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "Rename user",
                      onClick: () => {
                        setrenameAttendee(true);
                      },
                    },
                    {
                      key: "2",
                      label: "Remove user",
                      onClick: () => {
                        Modal.confirm({
                          title: "Remove User",
                          content:
                            "Are you sure do you want to remove this User !",
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
                      },
                    },
                  ],
                }}
              >
                <div className={classes.moreIcon}>
                  <i className="material-symbols-outlined">more_vert</i>
                </div>
              </Dropdown>
            ) : null}
          </div>
          {renameAttendee && (
            <RenameModal
              open={renameAttendee}
              ele={findAttendee}
              success={() => {
                toast.success("Renamed Successfully");
                setrenameAttendee(false);
              }}
              close={() => {
                setrenameAttendee(false);
              }}
            />
          )}
        </div>
        <Collapse in={SpeakerState === findAttendee.userId}>
          <div
            className={classes.speakerContainer}
            style={{
              background: "#f5f5f5",
            }}
          >
            <div className={classes.speakerSec}>
              <VolumeStatusComponent
                // isEnable={SpeakerState === findAttendee.userId}
                onClick={() => {
                  if (SpeakerState !== findAttendee.userId) {
                    setSpeakerState(findAttendee.userId);
                  } else {
                    setSpeakerState(false);
                  }
                }}
              />

              <Slider
                min={0}
                defaultValue={ele.volume}
                max={100}
                className="ms-3"
                tooltip
                onChange={(e) => {
                  const desiredVolume = parseInt(e) / 100;
                  const audioElement = audioElements[ele.chimeAttendeeId];
                  if (audioElement) {
                    audioElement.volume = desiredVolume;
                  }
                }}
              />
            </div>
          </div>
        </Collapse>
      </>
    );
  };

  return (
    <Layout
      className={`${classes.popupContainer} ${
        EventData?.type === 2 ? classes.talkshowPopup : ""
      }`}
    >
      <Header style={headerStyle} className={classes.headerStyle}>
        <div className={classes.popupHeader}>
          <div>
            <i className={`${styles.participant_icon} ${styles.icon}`}></i>
            <p>Participants</p>
          </div>
          <div>
            <i
              className="material-symbols-outlined"
              onClick={() => {
                setisSearchEnable((pre) => !pre);
              }}
            >
              search
            </i>
            <i
              className="material-symbols-outlined"
              onClick={() => {
                setisChatorParticipant(null);
              }}
            >
              cancel
            </i>
          </div>
        </div>
        <div>
          <Collapse in={isSearchEnable} className={classes.filterSec}>
            <InputGroup className="mb-2">
              <Form.Control
                className={`${classes.inSearch} ${classes.participantSearch}`}
                placeholder="Search Participants by name"
                aria-label="Search Participants by name"
                onChange={(e) => {
                  setSearchData(e.target.value);
                }}
              />
              <InputGroup.Text
                className={`${classes.searchIcon} ${classes.participantSearchIcon}`}
              >
                <span className="material-icons">search</span>
              </InputGroup.Text>
            </InputGroup>
          </Collapse>
        </div>
        <div className={classes.GlobalSettingContainer}>
          <div className={classes.itemName}>Global Settings</div>
          <div className={classes.itemAction}>
            <Collapse in={SpeakerState === "Global"}>
              <div
                className={classes.speakerContainer}
                style={{
                  background: "#f5f5f5",
                }}
              >
                <div className={classes.speakerSec}>
                  <VolumeStatusComponent
                    isEnable={true}
                    // isEnable={SpeakerState === findAttendee.userId}
                    onClick={() => {
                      if (SpeakerState !== "Global") {
                        setSpeakerState("Global");
                      } else {
                        setSpeakerState(false);
                      }
                    }}
                  />

                  <Slider min={0} max={100} className="ms-3" tooltip />
                </div>
              </div>
            </Collapse>
            <MicrophoneComponent
              isGlobal={true}
              className={classes.micsmallIcon}
            />
            <CameraComponent
              isGlobal={true}
              className={classes.videosmallIcon}
            />
          </div>
        </div>
      </Header>
      <Content className={classes.participantSec}>
        {attendees.map((ele, index) => {
          return ele ? AttendeeComponent({ ele }) : null;
        })}
      </Content>
      <Footer className={classes.footerSec}>
        <div className={classes.inviteContainer}>
          <div className={classes.inviteBtn}>Invite Participants</div>
        </div>

        {RequestRef.current.length !== 0 && (
          <div
            style={{
              marginTop: 15,
              paddingTop: "10px",
            }}
          >
            <p
              style={{
                marginBottom: 0,
                marginLeft: 10,
              }}
            >
              Requests ({RequestRef.current.length})
            </p>
            <div
              style={{
                maxHeight: 150,
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {RequestRef.current.map((ele, index) => {
                return (
                  <div className={classes.participantContainer}>
                    <div className={classes.itemName}>
                      <img src={ele.image} alt={`request_${index}`} />
                      {ele.name}
                    </div>
                    <div className={classes.itemAction}>
                      <div
                        className={classes.greenicon}
                        onClick={() => {
                          handleAccept(ele);
                        }}
                      >
                        <i className="material-symbols-outlined">done</i>
                      </div>
                      <div
                        className={classes.redicon}
                        onClick={() => {
                          handleReject(ele);
                        }}
                      >
                        <i className="material-symbols-outlined">close</i>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Footer>
    </Layout>
  );
};

export default Participants;
