import { Modal, Tooltip } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  JSONtoformdata,
  datetoString,
  decodeHtml,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../Shared/Utility";
import classes from "./Event.module.css";
import eventList from "../../Assets/Images/png/eventList.png";
import { deleteEventService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import moment from "moment";
import shareicon from "../../Assets/Icons/svg/shareicon.svg";

const Event = ({ ele, handleEdit, setList, isOthers = false }) => {
  const { userSettings, loginUserData } = useAuth();
  const navigate = useNavigate();
  const token = useAuthToken();

  const isCreatedUser = () => {
    if (loginUserData?.user_id === ele?.original_user_id) {
      return true;
    }
    return false;
  };

  const handleDelete = (ele) => {
    let deleteData = {
      token: token,
      event_id: ele.event_id,
    };
    deleteEventService(JSONtoformdata(deleteData))
      .then((res) => {
        if (res.data.status === 1) {
          if (setList) {
            setList((pre) =>
              pre.filter((elem) => elem.event_id !== ele.event_id)
            );
          }
          toast.success("Event Deleted Successfully !");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {});
  };

  const isNotExpired = () => {
    const createdTime = utctoUserTimezone(
      ele.start_date_time,
      userSettings?.time_zone
    );
    if (moment(createdTime).isBefore()) {
      return false;
    }
    return true;
  };

  return (
    <div
      className={`${classes.eventItem} ${
        isOthers ? classes.othersEventItem : ""
      }`}
    >
      <img
        className={classes.eventImg}
        src={ele?.banner_image !== "" ? ele?.banner_image : eventList}
        onClick={() => {
          navigate(`/viewevent/${ele.event_id}`);
        }}
        alt="Banner_img"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = eventList;
        }}
      />

      <div
        className={classes.talkshow}
        style={{ display: ele.type === 2 ? "block" : "none" }}
      >
        <div className={classes.talkshowIcon}>
          <span className={`material-symbols-outlined ${classes.recIcon}`}>
            radio_button_checked
          </span>
          TALK SHOW
        </div>
      </div>
      {!isOthers && (
        <div className={classes.share}>
          <img src={shareicon} />
        </div>
      )}
      <div className={classes.contentSec}>
        <div
          onClick={() => {
            navigate(`/viewevent/${ele.event_id}`);
          }}
        >
          <div className="d-flex flex-row justify-content-between">
            <Tooltip title={decodeHtml(ele.event_name)}>
              <h3
                style={{ maxWidth: isCreatedUser() ? "180px" : "" }}
                onClick={() => {
                  navigate(`/viewevent/${ele.event_id}`);
                }}
              >
                {decodeHtml(ele.event_name)}
              </h3>
            </Tooltip>
            {isNotExpired() && isCreatedUser() && (
              <div className={classes.editSec}>
                <div className={classes.iconBg}>
                  <i
                    className={classes.editIcon}
                    onClick={() => {
                      handleEdit(ele);
                    }}
                  ></i>
                </div>
                <div
                  className={classes.iconBg}
                  onClick={() => {
                    Modal.confirm({
                      title: "Confirmation",
                      okText: "Delete",
                      cancelText: "Cancel",
                      cancelButtonProps: {
                        danger: true,
                      },
                      content: <div>Do you want to delete this Event ? </div>,
                      onOk: () => {
                        handleDelete(ele);
                      },
                    });
                  }}
                >
                  <i class="material-symbols-outlined">delete</i>
                </div>
              </div>
            )}
          </div>
          <p className={classes.host}>
            Hosted by {decodeHtml(ele.original_user_name)}
          </p>
          <p className={classes.des}>{ele.message}</p>
          {isOthers ? (
            <p className={classes.iconsec}>
              {moment(
                utctoUserTimezone(ele.start_date_time, userSettings?.time_zone)
              ).format("DD MMM YYYY")}
              {" . "}
              {moment(
                utctoUserTimezone(ele.start_date_time, userSettings?.time_zone)
              ).format("hh:mm A") +
                " - (" +
                utctoUserTimezonewithAbbr(
                  ele.start_date_time,
                  userSettings?.time_zone
                ) +
                ")"}
            </p>
          ) : (
            <p className={classes.iconsec}>
              <span class="material-symbols-outlined">calendar_today</span>{" "}
              {moment(
                utctoUserTimezone(ele.start_date_time, userSettings?.time_zone)
              ).format("DD MMM YYYY")}
              <span class="material-symbols-outlined">schedule</span>{" "}
              {moment(
                utctoUserTimezone(ele.start_date_time, userSettings?.time_zone)
              ).format("hh:mm A") +
                " - (" +
                utctoUserTimezonewithAbbr(
                  ele.start_date_time,
                  userSettings?.time_zone
                ) +
                ")"}
            </p>
          )}
        </div>
        {isNotExpired() && (
          <Link className={classes.link}>
            {isCreatedUser() ? "Start Hosting" : "Join Event"}
            <span class="material-symbols-outlined">arrow_right_alt</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Event;
