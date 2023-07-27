import React, { useEffect, useState } from "react";
import classes from "./Room.module.css";
import { Layout } from "antd";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import styles from "../../../Layouts/MeetingLayout.module.css";
import { useMainContext } from "../../../Shared/Context";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";

const { Header, Footer, Content } = Layout;

const Participants = () => {
  const { attendees } = useMainContext();
  const { setisChatorParticipant, setRequestList, RequestRef } =
    useLayoutContect();

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

  return (
    <Layout className={classes.popupContainer}>
      <Header style={headerStyle} className={classes.headerStyle}>
        <div className={classes.popupHeader}>
          <div>
            <i className={`${styles.participant_icon} ${styles.icon}`}></i>
            <p>Participants</p>
          </div>
          <div>
            <i className="material-symbols-outlined">search</i>
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
                <span className="material-symbols-outlined">volume_up</span>
              )}
              <span className="material-symbols-outlined">mic</span>
              <span className="material-symbols-outlined">videocam</span>
            </div>
          </div>
        ))}
      </Content>
      <Footer className={classes.footerSec}>
        <div className={classes.inviteContainer}>
          <div
            className={classes.inviteBtn}
            // onClick={() => {
            //   setinviteParticipantsCount((pre) => pre + 1);
            // }}
          >
            Invite Participants
          </div>
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
