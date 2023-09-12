import { useState } from "react";
import classes from "./Room.module.css";
import { Dropdown, Layout, Modal, Slider, Tooltip } from "antd";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { useRosterState } from "amazon-chime-sdk-component-library-react";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
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
import { generatePath } from "react-router";
import { handleCopyText } from "../../../Shared/Utility";
import {
  AttendeeUserData,
  EventContextProp,
  RequestAttendee,
} from "../Components/types";
import { useEventRoomContext } from "../../../Shared/Context";

const { Header, Footer, Content } = Layout;

const Participants = () => {
  const [isSearchEnable, setisSearchEnable] = useState(false);
  const [SpeakerState, setSpeakerState] = useState<boolean | number | string>(
    false
  );
  const [renameAttendee, setrenameAttendee] = useState<any>(false);
  const [SearchData, setSearchData] = useState("");
  const {
    setisChatorParticipant,
    RequestRef,
    attendeesList,
    EventData,
    userdata,
  }: EventContextProp = useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const [isInvited, setisInvited] = useState(false);
  const [isCopied, setisCopied] = useState(false);

  /* To get Rawcaster user or non Rawcaster User */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  /**
   * Get Updated Status for Host
   */
  const getISHost = () => {
    return userdata?.isHost;
  };

  /* Handle Accept the Attendee Join Request  */
  const handleAccept = (ele: RequestAttendee) => {
    ChimesendMessage(
      { ...ele, refId: EventData?.reference_id },
      CHIME_SOCKET_EVENTS.ALLOW_TO_JOIN_MEETING
    );
    RequestRef.current = RequestRef.current.filter(
      (elem: RequestAttendee) => elem.userId !== ele.userId
    );
  };

  /* Handle Reject the Attendee Join Request  */

  const handleReject = (ele: RequestAttendee) => {
    const value = { userId: ele.userId };
    ChimesendMessage(value, CHIME_SOCKET_EVENTS.REJECT_TO_JOIN_MEETING);
    RequestRef.current = RequestRef.current.filter(
      (elem: RequestAttendee) => elem.userId !== ele.userId
    );
  };

  const AttendeeComponent = ({ ele }) => {
    const findAttendee = attendeesList.find(
      (elem) => elem.userId === parseInt(ele.externalUserId)
    );
    const isYou = getUserData()?.user_id === findAttendee?.userId;

    /* List of Attendee Handling Options */

    const getDropdownList = (ele: AttendeeUserData) => {
      if (ele?.isHost) {
        return [
          {
            key: "1",
            label: "Rename user",
            onClick: () => {
              setrenameAttendee(findAttendee);
            },
          },
        ];
      }
      return [
        {
          key: "0",
          label: "Promote as Host",
          onClick: () => {
            Modal.confirm({
              title: "Promote as Host",
              content:
                "Are you sure do you want to Promote as Host for this User !",
              onOk: () => {
                ChimesendMessage(
                  {
                    refId: EventData?.reference_id,
                    hostId: EventData?.original_user_id,
                    userId: findAttendee?.userId,
                  },
                  CHIME_SOCKET_EVENTS.MAKE_HOST
                );
              },
              onCancel: () => {},
            });
          },
        },
        {
          key: "1",
          label: "Rename user",
          onClick: () => {
            setrenameAttendee(findAttendee);
          },
        },
        {
          key: "2",
          label: "Remove user",
          onClick: () => {
            Modal.confirm({
              title: "Remove User",
              content: "Are you sure do you want to remove this User !",
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
      ];
    };

    return (
      <>
        <audio
          style={{
            display: "none",
          }}
        />
        <div
          className={classes.participantContainer}
          style={{
            display: findAttendee?.name
              ?.toLowerCase()
              .includes(SearchData?.toLowerCase())
              ? ""
              : "none",
          }}
        >
          <div className={classes.itemName}>
            <img
              src={findAttendee?.image ? findAttendee?.image : ""}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = defaultprofileImg;
              }}
            />
            <div className={classes.nameSec}>
              <span className={classes.participantName}>
                {findAttendee?.name}
              </span>
              {`${isYou ? " (You)" : ""}`}
            </div>
          </div>
          <div className={classes.itemAction}>
            {findAttendee?.handRaised && (
              <span className={styles.raise_hand_active_icon_sm} />
            )}
            {findAttendee?.isHost ? (
              <div className={classes.hostIcon}>HOST</div>
            ) : null}
            {!isYou && (
              <VolumeStatusComponent
                ele={ele}
                className={classes.speakersmallIcon}
                onClick={() => {
                  if (
                    SpeakerState &&
                    findAttendee &&
                    SpeakerState !== findAttendee?.userId
                  ) {
                    setSpeakerState(findAttendee.userId);
                  } else {
                    setSpeakerState(false);
                  }
                }}
              />
            )}
            {isYou ? (
              <LocalMicrophoneComponent className={classes.micsmallIcon} />
            ) : (
              <MicrophoneComponent
                ele={ele}
                attendee={findAttendee}
                isHost={getISHost()}
                className={classes.micsmallIcon}
                isGlobal={false}
              />
            )}

            {isYou ? (
              <LocalCameraComponent
                setselectedDevice={null}
                selectedDevice={null}
                className={classes.videosmallIcon}
              />
            ) : (
              <CameraComponent
                ele={ele}
                attendee={findAttendee}
                isHost={getISHost()}
                className={classes.videosmallIcon}
                isGlobal={false}
              />
            )}
            {getISHost() ? (
              <Dropdown
                menu={{
                  items: findAttendee ? getDropdownList(findAttendee) : [],
                }}
              >
                <div className={classes.moreIcon}>
                  <i className="material-symbols-outlined">more_vert</i>
                </div>
              </Dropdown>
            ) : null}
          </div>
        </div>
        <Collapse in={SpeakerState === findAttendee?.userId}>
          <div
            className={classes.speakerContainer}
            style={{
              background: "#f5f5f5",
            }}
          >
            <div className={classes.speakerSec}>
              <VolumeStatusComponent
                onClick={() => {
                  if (findAttendee && SpeakerState !== findAttendee?.userId) {
                    setSpeakerState(findAttendee?.userId);
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
                tooltip={{
                  open: true,
                }}
              />
            </div>
          </div>
        </Collapse>
      </>
    );
  };

  /* Generate Invite Link  */
  const getInviteLink = () => {
    return (
      window.location.origin +
      generatePath(`/join/:event/:ref_id`, {
        event: EventData?.type === 2 ? "talkshow" : "event",
        ref_id: EventData?.reference_id || "",
      })
    );
  };

  return (
    <Layout
      className={`${classes.popupContainer} ${
        EventData?.type === 2 ? classes.talkshowPopup : ""
      }`}
    >
      <Header
        style={{
          textAlign: "center",
          color: "#fff",
          lineHeight: 64,
          backgroundColor: "#7dbcea",
        }}
        className={classes.headerStyle}
      >
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
        {getISHost() && (
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

                    <Slider min={0} max={100} className="ms-3" />
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
        )}
      </Header>
      <Content className={classes.participantSec}>
        {attendees.map((ele, index) => {
          return ele ? AttendeeComponent({ ele }) : null;
        })}
        <RenameModal
          key={renameAttendee?.userId}
          open={renameAttendee}
          ele={renameAttendee}
          success={() => {
            toast.remove("rawcaster");
            toast.success("Renamed Successfully", { id: "rawcaster" });
            setrenameAttendee(false);
          }}
          close={() => {
            setrenameAttendee(false);
          }}
        />
      </Content>
      <Footer className={classes.footerSec}>
        {RequestRef.current.length !== 0 && (
          <div
            style={{
              marginTop: 15,
              marginBottom: RequestRef.current.length !== 0 ? 20 : 0,
            }}
          >
            <div
              className={`${classes.participantContainer} ${classes.lobbyHeader}`}
            >
              <p
                style={{
                  marginBottom: 0,
                }}
              >
                Lobby ({RequestRef.current.length})
              </p>
              <div className={classes.itemAction}>
                <div
                  className={classes.greenicon}
                  onClick={() => {
                    RequestRef.current.map((ele) => {
                      handleAccept(ele);
                    });
                  }}
                >
                  <i className="material-symbols-outlined">done</i>
                </div>
                <div
                  className={classes.redicon}
                  onClick={() => {
                    RequestRef.current.map((ele) => {
                      handleReject(ele);
                    });
                  }}
                >
                  <i className="material-symbols-outlined">close</i>
                </div>
              </div>
            </div>
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
        <div
          className={classes.inviteContainer}
          onClick={() => {
            setisInvited((pre) => !pre);
          }}
        >
          <div className={classes.inviteBtn}>Invite Participants</div>
        </div>
        <Collapse in={isInvited}>
          <div className={classes.inviteModal}>
            <h2>Invite via Meeting Link</h2>
            <div className={classes.MeetingLinkSec}>
              <p> {getInviteLink()}</p>
              <Tooltip placement="top" title={"Copy"}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isCopied ? (
                    <span className={`material-symbols-rounded`}>done</span>
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      onClick={() => {
                        handleCopyText(getInviteLink()).then(() => {
                          setisCopied(true);
                        });
                      }}
                    >
                      content_copy
                    </span>
                  )}
                </div>
              </Tooltip>
            </div>
          </div>
        </Collapse>
      </Footer>
    </Layout>
  );
};

export default Participants;
