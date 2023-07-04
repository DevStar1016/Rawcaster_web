import React, { useEffect, useState } from "react";
import classes from "./Room.module.css";
import { Layout } from "antd";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { useEventLayout } from "../../../Layouts/EventLayout";
import { useMainContext } from "../../../Shared/Context";
import { ChimesocketListen } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";

const { Header, Footer, Content } = Layout;

const Participants = () => {
  const { attendees } = useMainContext();
  const { setisChatorParticipant } = useEventLayout();
  const [inviteParticipantsCount, setinviteParticipantsCount] = useState(0);
  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
  };

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM, (message) => {
      console.log(message);
    });
  }, []);

  return (
    <Layout className={classes.popupContainer}>
      <Header style={headerStyle} className={classes.headerStyle}>
        <div className={classes.popupHeader}>
          <div>
            <i className={`${styles.participant_icon} ${styles.icon}`}></i>
            <p>Participants</p>
          </div>
          <div>
            <i class="material-symbols-outlined">search</i>
            <i
              class="material-symbols-outlined"
              onClick={() => {
                setisChatorParticipant(null);
              }}
            >
              cancel
            </i>
          </div>
        </div>
        <div className={classes.GlobalSettingContainer}>
          <div className={classes.itemName}>Global Settings</div>
          <div className={classes.itemAction}>
            <span class="material-symbols-outlined">volume_up</span>
            <span class="material-symbols-outlined">mic</span>
            <span class="material-symbols-outlined">videocam</span>
          </div>
        </div>
      </Header>
      <Content className={classes.participantSec}>
        {attendees.map((ele, index) => (
          <div className={classes.participantContainer}>
            <div className={classes.itemName}>
              <img src={defaultprofileImg} />
              {ele.externalUserId}
            </div>
            <div className={classes.itemAction}>
              {ele.externalUserId === "Me" ? (
                <div className={classes.hostIcon}>HOST</div>
              ) : (
                <span class="material-symbols-outlined">volume_up</span>
              )}
              <span class="material-symbols-outlined">mic</span>
              <span class="material-symbols-outlined">videocam</span>
            </div>
          </div>
        ))}
      </Content>
      <Footer className={classes.footerSec}>
        <div className={classes.inviteContainer}>
          <div
            className={classes.inviteBtn}
            onClick={() => {
              setinviteParticipantsCount((pre) => pre + 1);
            }}
          >
            Invite Participants
          </div>
        </div>

        {inviteParticipantsCount !== 0 && (
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
              Requests ({inviteParticipantsCount})
            </p>
            <div
              style={{
                maxHeight: 150,
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {[...new Array(inviteParticipantsCount)].map((ele) => (
                <div className={classes.participantContainer}>
                  <div className={classes.itemName}>
                    <img src={defaultprofileImg} />
                    Rawcaster User
                  </div>
                  <div className={classes.itemAction}>
                    <div className={classes.greenicon}>
                      <i class="material-symbols-outlined">done</i>
                    </div>
                    <div className={classes.redicon}>
                      <i class="material-symbols-outlined">close</i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Footer>
    </Layout>
  );
};

export default Participants;
