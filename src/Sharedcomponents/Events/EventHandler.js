import React from "react";
import classes from "./Event.module.css";
import { useDispatch } from "react-redux";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { fetchActiveEventData } from "../../Store/Redux/Action";
import { useMainContext } from "../../Shared/Context";

const EventHandler = ({ title, isHost, meetingId }) => {
  const { setActiveEvent } = useMainContext();
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
  return (
    <div
      className={classes.link}
      onClick={(e) => {
        handleJoinEvent(e);
      }}
    >
      {isHost ? `Start ${title}` : `Join ${title}`}
      <span className="material-symbols-outlined">arrow_right_alt</span>
    </div>
  );
};

export default EventHandler;
