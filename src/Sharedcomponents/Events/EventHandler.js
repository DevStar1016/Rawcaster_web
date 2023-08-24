import React, { useState } from "react";
import classes from "./Event.module.css";
import EventStartModal from "../../Modal/Event/EventStartModal";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { ChimesendMessage } from "../../Services/SocketService";
import { Modal } from "antd";

const EventHandler = ({ title, isHost, meetingId, ele }) => {
  const userData = useAuthData();
  const [openModal, setopenModal] = useState({ show: false, type: "" });
  const [isLoading, setisLoading] = useState(false);
  let popup;

  const closeModal = (e) => {
    e.stopPropagation();
    setopenModal({ show: false, type: "" });
  };

  const HandlePopup = () => {
    popup = window.open(`/room/${meetingId}`, "_blank", {
      popup: true,
    });
    popup.onload = () => {
      console.log("Onload");
      ChimesendMessage(
        { userId: userData.user_id },
        CHIME_SOCKET_EVENTS.JOIN_SOCKET
      );
      localStorage.setItem("EventData", JSON.stringify(ele));
      if (isHost) {
        ChimesendMessage(
          { refId: ele?.reference_id },
          CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM
        );
      } else {
        ChimesendMessage(
          { refId: ele?.reference_id },
          CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
        );
      }
      ChimesendMessage(
        {
          userId: userData?.user_id,
          refId: ele?.reference_id,
          name: userData?.name,
          image: userData?.profile_image,
        },
        CHIME_SOCKET_EVENTS.JOIN_REQUEST
      );
    };
    // when the popup unloads
    popup.onunload = () => {
      let keysToRemove = [
        "EventData",
        CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
        CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING,
        CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER,
        CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
        CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND,
        CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER,
        CHIME_SOCKET_EVENTS.DISABLE_SHARE_SCREEN_ANSWER,
        CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER,
        CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER,
        CHIME_SOCKET_EVENTS.DISABLE_AUDIO_ANSWER,
        CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER,
        CHIME_SOCKET_EVENTS.END_MEETING_ANSWER,
        CHIME_SOCKET_EVENTS.KICK_USER_ANSWER,
      ];

      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
    };

    // popup.addEventListener("beforeunload", (event) => {
    //   const confirmationMessage = "Do you want to leave the meeting?";
    //   event.returnValue = confirmationMessage;
    //   return confirmationMessage;
    // });

    // when the popup posts a message
  };

  const handleJoinEvent = async (e) => {
    e.stopPropagation();
    if (isHost) {
      setopenModal({ show: true, type: "Start Hosting" });
    } else {
      HandlePopup();
    }
  };

  return (
    <>
      <div
        className={classes.link}
        onClick={(e) => {
          handleJoinEvent(e);
        }}
      >
        {isHost ? `Start ${title}` : `Join ${title}`}
        <span className="material-symbols-outlined">arrow_right_alt</span>
      </div>

      {openModal.show && (
        <EventStartModal
          openmodal={openModal.show}
          type={openModal.type}
          close={closeModal}
          isLoading={isLoading}
          onStart={(e) => {
            e.stopPropagation();
            setisLoading(true);
            HandlePopup();
            setisLoading(false);
            setopenModal({ show: false, type: "" });
          }}
        />
      )}
    </>
  );
};

export default EventHandler;
