import { Modal, Popover, Tooltip } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  JSONtoformdata,
  decodeHtml,
  getusetId,
  shareEventDate,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../Shared/Utility";
import classes from "./Event.module.css";
import eventList from "../../Assets/Images/png/eventList.png";
import { deleteEventService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import moment from "moment";
import shareicon from "../../Assets/Icons/svg/shareicon.svg";
import { SHARE_URL } from "../../Shared/Constant";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import FaceBookIcon from "../../Assets/Icons/svg/facebook.svg";
import WhatsappIcon from "../../Assets/Icons/svg/whatsapp.svg";
import TwitterIcon from "../../Assets/Icons/svg/twitterIcon.svg";
import GmailIcon from "../../Assets/Icons/svg/gmail_icon.svg";
import EventHandler from "./EventHandler";

const Event = ({ ele, handleEdit, setList, isOthers = false }) => {
  const { userSettings, loginUserData } = useAuth();
  const navigate = useNavigate();
  const token = useAuthToken();
  const eventType =
    ele.type === 1 ? "event/" : ele.type === 2 ? "talkshow/" : "golive/";

  const isCreatedUser = () => {
    if (loginUserData?.user_id === getusetId(ele?.original_user_id)) {
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
    const momenttimezone = require("moment-timezone");
    const currentTime = momenttimezone.utc().format("YYYY-MM-DD HH:mm:ss");
    // if (moment(ele.start_date_time).isBefore(currentTime)) {
    //   return false;
    // }
    return true;
  };

  const shareMessage = `Hi,\n ${
    ele.original_user_name
  } is inviting you to join a web event called ${ele.event_name} on ${
    shareEventDate(
      utctoUserTimezone(ele.start_date_time, userSettings.time_zone)
    ) + utctoUserTimezonewithAbbr(ele.start_date_time, userSettings.time_zone)
  }. The link for this Rawcaster event is :`;

  const shareUrl = SHARE_URL + eventType + ele.reference_id;

  const content = (
    <div className={classes.socialmediashare}>
      <p>
        <FacebookShareButton
          quote={shareMessage + " " + shareUrl}
          url={shareUrl}
        >
          <img src={FaceBookIcon} alt="Facebook"></img>
        </FacebookShareButton>
      </p>

      <p>
        <TwitterShareButton
          title={shareMessage}
          via={"Rawcaster"}
          url={shareUrl}
        >
          <img src={TwitterIcon} alt="Facebook"></img>
        </TwitterShareButton>
      </p>
      <p>
        <EmailShareButton
          subject={"Rawcaster Event Invite"}
          body={shareMessage}
          url={shareUrl}
        >
          <img src={GmailIcon} alt="Facebook"></img>
        </EmailShareButton>
      </p>
      <p>
        <WhatsappShareButton
          //  title="dhdsdfsdfsfsdf"
          title={shareMessage}
          url={shareUrl}
          separator=" "
        >
          <img src={WhatsappIcon} alt="Facebook"></img>
        </WhatsappShareButton>
      </p>
    </div>
  );

  return (
    <div
      onClick={() => {
        navigate(`/viewevent/${ele.event_id}`);
      }}
      style={{
        cursor: "pointer",
      }}
      className={`${classes.eventItem} ${
        isOthers ? classes.othersEventItem : ""
      }`}
    >
      <img
        className={classes.eventImg}
        src={ele?.banner_image !== "" ? ele?.banner_image : eventList}
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
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={classes.share}
        >
          <Popover placement="leftTop" content={content} trigger="hover">
            <img src={shareicon} alt={"Share icon"} />
          </Popover>
        </div>
      )}
      <div className={classes.contentSec}>
        <div
        // onClick={() => {
        //   navigate(`/viewevent/${ele.event_id}`);
        // }}
        >
          <div className="d-flex flex-row justify-content-between">
            <Tooltip title={decodeHtml(ele.event_name)}>
              <h3 style={{ maxWidth: isCreatedUser() ? "180px" : "" }}>
                {decodeHtml(ele.event_name)}
              </h3>
            </Tooltip>
            {isNotExpired() && isCreatedUser() && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={classes.editSec}
              >
                <div className={classes.iconBg}>
                  <i
                    className={classes.editIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(ele);
                    }}
                  ></i>
                </div>
                <div
                  className={classes.iconBg}
                  onClick={(e) => {
                    e.stopPropagation();
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
                  <i className="material-symbols-outlined">delete</i>
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
              <span className="material-symbols-outlined">calendar_today</span>{" "}
              {moment(
                utctoUserTimezone(ele.start_date_time, userSettings?.time_zone)
              ).format("DD MMM YYYY")}
              <span className="material-symbols-outlined">schedule</span>{" "}
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
          <EventHandler
            isHost={isCreatedUser()}
            title={ele.type === 2 ? "Talkshow" : "Event"}
            meetingId={ele.event_id}
            ele={ele}
          />
        )}
      </div>
    </div>
  );
};

export default Event;
