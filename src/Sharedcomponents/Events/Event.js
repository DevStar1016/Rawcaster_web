import { Tooltip } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import classes from "./Event.module.css";

const Event = ({ ele, handleEdit }) => {
  const loginUserData = useAuthData();

  const isCreatedUser = () => {
    if (loginUserData?.user_id === ele?.original_user_id) {
      return true;
    }
    return false;
  };
  return (
    <div className={classes.eventItem}>
      <img className={classes.eventImg} src={ele?.banner_image} />
      <div className={classes.view}>
        <span class="material-symbols-outlined">visibility</span>{" "}
        {ele.no_of_participants}
      </div>
      <div className={classes.share}>
        <span class="material-symbols-outlined">share</span>
      </div>
      <div className={classes.contentSec}>
        <div className="d-flex flex-row justify-content-between">
          <Tooltip title={decodeHtml(ele.event_name)}>
            <h3 style={{ maxWidth: isCreatedUser() ? "180px" : "" }}>
              {decodeHtml(ele.event_name)}
            </h3>
          </Tooltip>
          {isCreatedUser() && (
            <div className={classes.editSec}>
              <div className={classes.iconBg}>
                <i
                  className={classes.editIcon}
                  onClick={() => {
                    handleEdit(ele);
                  }}
                ></i>
              </div>
              <div className={classes.iconBg}>
                <i class="material-symbols-outlined">delete</i>
              </div>
            </div>
          )}
        </div>
        <p className={classes.host}>Hosted by {ele.original_user_name}</p>
        <p className={classes.des}>{ele.message}</p>
        <p className={classes.iconsec}>
          <span class="material-symbols-outlined">calendar_today</span>{" "}
          {ele.start_date}
          <span class="material-symbols-outlined">schedule</span>{" "}
          {ele.start_time}
        </p>
        <Link className={classes.link}>
          {isCreatedUser() ? "Start Hosting" : "Join Event"}
          <span class="material-symbols-outlined">arrow_right_alt</span>
        </Link>
      </div>
    </div>
  );
};

export default Event;
