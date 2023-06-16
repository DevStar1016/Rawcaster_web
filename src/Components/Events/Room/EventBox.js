import React, { useEffect, useState } from "react";
import classes from "./EventBox.module.css";
import userImg from "../../../Assets/Images/svg/userImg.svg";
import { useEventLayout } from "../../../Layouts/EventLayout";
import { useMainContext, useMeetingContext } from "../../../Shared/Context";
import {
  ContentShare,
  LocalVideo,
  RemoteVideo,
  useAttendeeStatus,
  useContentShareState,
  useLocalVideo,
  useRemoteVideoTileState,
} from "amazon-chime-sdk-component-library-react";
import Participants from "./Participants";
import ChatBox from "./ChatBox";

const EventBox = () => {
  const { attendees } = useMainContext();
  const { isVideoEnabled } = useLocalVideo();
  const { isLocalUserSharing, sharingAttendeeId } = useContentShareState();
  const { attendeeIdToTileId } = useRemoteVideoTileState();
  const { isPinEnabled, isChatorParticipant } = useEventLayout();

  const getContainerClassName = () => {
    switch (attendees.length) {
      case 1:
        return classes.full_container;
      case 2:
        return classes.Half_container;
      case 3:
        return classes.grid_initial_3_boxes;
      case 4:
        return classes.grid_initial_4_boxes;
      case 5:
        return classes.grid_initial_5_boxes;
      case 6:
        return classes.grid_initial_5_boxes;
      case 7:
        return classes.grid_4_boxes;
      case 8:
        return classes.grid_4_boxes;
      default:
        return isChatorParticipant
          ? classes.grid_4_boxes
          : classes.grid_5_boxes;
    }
  };

  const GetDisplayComponent = ({ ele }) => {
    const { muted, videoEnabled, sharingContent, signalStrength } =
      useAttendeeStatus(ele.chimeAttendeeId);
    if (videoEnabled || isVideoEnabled) {
      const value = attendeeIdToTileId[ele.chimeAttendeeId];
      if (value) {
        return (
          <RemoteVideo
            className={classes.Child}
            name={ele.externalUserId}
            nameplate={ele.externalUserId}
            tileId={value}
          />
        );
      } else {
        if (isVideoEnabled) {
          return (
            <LocalVideo
              className={classes.Child}
              nameplate={ele.externalUserId}
            />
          );
        } else {
          return (
            <div className={classes.Child}>
              <img src={userImg} />
              <p>{ele.externalUserId}</p>
            </div>
          );
        }
      }
    } else {
      return (
        <div className={classes.Child}>
          <img src={userImg} />
          <p>{ele.externalUserId}</p>
        </div>
      );
    }
  };

  return (
    <div className={classes.mainContainer}>
      <div
        className={classes.video_grid}
        style={{
          width: isChatorParticipant ? "80" : "100%",
        }}
      >
        <div
          className={
            isPinEnabled && attendees.length >= 10
              ? classes.isPinavailablePinSec
              : classes.PinSec
          }
        >
          {isPinEnabled && attendees.length >= 10 && (
            <div className={classes.pinned_video}>
              <img src={userImg} />
              <p>{"Participant "}</p>
            </div>
          )}
        </div>
        <div
          className={
            isPinEnabled && attendees.length >= 10
              ? classes.isPinavailableSec
              : classes.ParticipantSec
          }
          style={{
            overflow: "scroll",
          }}
        >
          {isLocalUserSharing || sharingAttendeeId ? (
            <div className={classes.full_container}>
              <ContentShare className={classes.Child} />
            </div>
          ) : (
            <div className={`mx-auto ${getContainerClassName()}`}>
              {attendees.map((ele, index) => {
                return <GetDisplayComponent ele={ele} />;
              })}
            </div>
          )}
        </div>
      </div>
      {isChatorParticipant && (
        <div className={classes.participantsSec}>
          {isChatorParticipant === "participant" ? (
            <Participants />
          ) : isChatorParticipant === "chat" ? (
            <ChatBox />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EventBox;
