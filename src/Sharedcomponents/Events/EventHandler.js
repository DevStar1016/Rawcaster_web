import React, { useEffect, useState } from "react";
import classes from "./Event.module.css";
import EventStartModal from "../../Modal/Event/EventStartModal";
import { Modal } from "antd";

const EventHandler = ({ title, isHost, meetingId }) => {
  const [openModal, setopenModal] = useState(false);
  const handleJoinEvent = async (e) => {
    e.stopPropagation();
    window.open(`/room/${meetingId}`, "_blank", {
      popup: true,
    });
  };

  const closeModal = (e) => {
    console.log("openmodalopenmodal fdf");
    e.stopPropagation();
    setopenModal(false);
  };
  useEffect(() => {
    console.log(openModal, "openmodalopenmodal");
  }, [openModal]);
  return (
    <>
      <div
        className={classes.link}
        onClick={(e) => {
          // handleJoinEvent(e);
          e.stopPropagation();
          setopenModal(true);
        }}
      >
        {isHost ? `Start ${title}` : `Join ${title}`}
        <span className="material-symbols-outlined">arrow_right_alt</span>
      </div>
      {openModal && (
        <EventStartModal openmodal={openModal} close={closeModal} />
      )}
    </>
  );
};

export default EventHandler;
