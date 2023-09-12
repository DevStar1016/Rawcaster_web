/**
 * A React component that handles event-related functionality such as joining or hosting an event.
 * @param {string} title - The title of the event.
 * @param {boolean} isHost - Indicates whether the user is the host of the event.
 * @param {object} ele - The event object.
 * @returns A React component that renders the event link and modal.
 */
import { useState } from "react";
import classes from "./Event.module.css";
import EventStartModal from "../../Modal/Event/EventStartModal";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { ChimesendMessage } from "../../Services/SocketService";
import { useDispatch } from "react-redux";
import { handleEventWindowRef } from "../../Store/Redux/Reducer/UtilityReducer";

const EventHandler = ({ title, isHost, ele }) => {
  const userData = useAuthData();
  const dispatch = useDispatch();
  const [openModal, setopenModal] = useState({ show: false, type: "" });
  const [isLoading, setisLoading] = useState(false);

  /**
   * Closes the modal by setting the `show` property of `openModal` state to `false`
   * and clearing the `type` property.
   * @param {Event} e - The event object.
   * @returns None
   */
  const closeModal = (e) => {
    e.stopPropagation();
    setopenModal({ show: false, type: "" });
  };

  /**
   * Handles the opening and manipulation of a popup window for a specific event.
   * @returns None
   */
  const HandlePopup = () => {
    const EventWindowRef = window.open(`/room/${ele?.reference_id}`, "_blank", {
      popup: true,
    });
    dispatch(handleEventWindowRef(EventWindowRef));

    EventWindowRef.onload = () => {
      const EventData = {
        type: "EventData",
        message: ele,
      };
      EventWindowRef.postMessage(EventData, "*");
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

    EventWindowRef.onclose = (e) => {
      e.stopPropagation();
    };
    // when the popup unloads
  };

  /**
   * Handles the join event.
   * @param {Event} e - The event object.
   * @returns None
   */
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
