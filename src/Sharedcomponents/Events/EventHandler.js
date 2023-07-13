import React, { useEffect, useState } from "react";
import classes from "./Event.module.css";
import { useDispatch } from "react-redux";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { fetchActiveEventData } from "../../Store/Redux/Action";
import { useMainContext } from "../../Shared/Context";
import EventStartModal from "../../Modal/Event/EventStartModal";

const EventHandler = ({ title, isHost, meetingId }) => {
  const { setActiveEvent } = useMainContext();
  const [openModal, setopenModal] = useState(false);

  const token = useAuthToken();
  const dispatch = useDispatch();
  const handleJoinEvent = async (e) => {
    e.stopPropagation();
    dispatch(
      fetchActiveEventData({
        token,
        ref_id: meetingId,
      })
    ).then(({ payload }) => {
      setActiveEvent(payload);
      window.open(
        payload.is_host === 1
          ? `/room/${meetingId}`
          : `/waitingroom/${meetingId}`,
        "_blank",
        {
          popup: true,
        }
      );
    });

    // if (isHost) {
    //   window.open(`/room/${meetingId}`, "_blank", {
    //     popup: true,
    //   });
    // } else {
    //   window.open(`/waitingroom/${meetingId}`, "_blank", {
    //     popup: true,
    //   });
    // }
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
