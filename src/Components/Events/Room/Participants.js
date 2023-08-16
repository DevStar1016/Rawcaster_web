import { useState } from "react";
import classes from "./Room.module.css";
import { Layout, Slider, message } from "antd";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { useRosterState } from "amazon-chime-sdk-component-library-react";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { Collapse, Form, InputGroup } from "react-bootstrap";
import {
  CameraComponent,
  LocalCameraComponent,
  LocalMicrophoneComponent,
  MicrophoneComponent,
  VolumeStatusComponent,
} from "../Components/Utility";

const { Header, Footer, Content } = Layout;

const Participants = () => {
  const [isSearchEnable, setisSearchEnable] = useState(false);
  const [SpeakerState, setSpeakerState] = useState(false);
  const [SearchData, setSearchData] = useState("");
  const {
    setisChatorParticipant,
    setRequestList,
    RequestRef,
    isHost,
    RaiseHandUsers,
    attendeesList,
    EventData,
  } = useLayoutContect();
  const userdata = useAuthData();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
  };

  const handleAccept = (ele) => {
    const value = { userId: ele.userId, meetingId: ele.meetingId };
    ChimesendMessage(value, CHIME_SOCKET_EVENTS.ALLOW_TO_JOIN_MEETING);
    setRequestList((pre) => pre.filter((elem) => elem.userId !== ele.userId));
    RequestRef.current = RequestRef.current.filter(
      (elem) => elem.userId !== ele.userId
    );
  };

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
      (elem) => parseInt(elem.id) === parseInt(ele.externalUserId)
    );

    const isYou = parseInt(userdata.user_id) === parseInt(findAttendee.id);

    const find_raise_hand = RaiseHandUsers.find(
      (elem) => parseInt(elem.user_id) === parseInt(findAttendee.id)
    );

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
            {find_raise_hand && (
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
                  if (SpeakerState !== findAttendee.id) {
                    setSpeakerState(findAttendee.id);
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
              <div className={classes.moreIcon}>
                <i className="material-symbols-outlined">more_vert</i>
              </div>
            ) : null}
          </div>
        </div>
        <Collapse in={SpeakerState === findAttendee.id}>
          <div
            className={classes.speakerContainer}
            style={{
              background: "#f5f5f5",
            }}
          >
            <div className={classes.speakerSec}>
              <VolumeStatusComponent
                // isEnable={SpeakerState === findAttendee.id}

                onClick={() => {
                  if (SpeakerState !== findAttendee.id) {
                    setSpeakerState(findAttendee.id);
                  } else {
                    setSpeakerState(false);
                  }
                }}
              />
              {/* <span
                className="material-symbols-outlined"
                style={{
                  color: "white",
                }}
                onClick={() => {
                  if (SpeakerState !== findAttendee.id) {
                    setSpeakerState(findAttendee.id);
                  } else {
                    setSpeakerState(false);
                  }
                }}
              >
                volume_up
              </span> */}
              <Slider
                min={0}
                max={1}
                className="ms-3"
                tooltip
                onChange={(e) => {
                  console.log(e, "activeSpeakersactiveSpeakers");
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
            <span className="material-symbols-outlined">volume_up</span>
            <span className="material-symbols-outlined">mic</span>
            <span className="material-symbols-outlined">videocam</span>
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
                      <img src={ele.user_img} alt={`request_${index}`} />
                      {ele.user_name}
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
