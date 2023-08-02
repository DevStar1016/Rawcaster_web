import React, { useEffect, useState } from "react";
import classes from "./Event.module.css";
import { useDispatch } from "react-redux";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { fetchActiveEventData } from "../../Store/Redux/Action";
import EventStartModal from "../../Modal/Event/EventStartModal";

const EventHandler = ({ title, isHost, meetingId, ele }) => {
  const [openModal, setopenModal] = useState({ show: false, type: "" });
  const [isLoading, setisLoading] = useState(false);
  const token = useAuthToken();
  const dispatch = useDispatch();
  const handleJoinEvent = async (e) => {
    e.stopPropagation();
    if (isHost) {
      setopenModal({ show: true, type: "Start Hosting" });
    } else {
      setopenModal({ show: true, type: "Join Meeting" });
    }
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setopenModal({ show: false, type: "" });
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
            setopenModal({ show: false, type: "" });
            // setisLoading(true);
            // dispatch(
            //   fetchActiveEventData({
            //     token,
            //     ref_id: meetingId,
            //   })
            // ).then(({ payload }) => {
            //   window.open(`/room/${meetingId}`, "_blank", {
            //     popup: true,
            //   });
            //   setisLoading(false);
            //   setopenModal({ show: false, type: "" });
            // });
          }}
        />
      )}
    </>
  );
};

export default EventHandler;
