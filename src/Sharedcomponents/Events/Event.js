/**
 * Represents a single event component.
 * @param {Object} ele - The event object.
 * @param {Function} handleEdit - The function to handle editing the event.
 * @param {Function} setList - The function to set the event list.
 * @param {boolean} [isOthers=false] - Indicates if the event is created by someone else.
 * @returns The event component.
 */
import { Modal, Popover, Tooltip } from "antd";
import { generatePath, useNavigate } from "react-router-dom";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  JSONtoformdata,
  decodeHtml,
  getCustomPartialDisplayName,
  shareEventDate,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../Shared/Utility";
import classes from "./Event.module.css";
import eventList from "../../Assets/Images/png/eventList.png";
import { deleteEventService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import moment from "moment";
import shareicon from "../../Assets/Icons/svg/shareiconblack.svg";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import FaceBookIcon from "../../Assets/Icons/svg/facebook.svg";
import WhatsappIcon from "../../Assets/Icons/svg/whatsapp.svg";
import TwitterIcon from "../../Assets/Icons/svg/twitter_x_logo.svg";
import GmailIcon from "../../Assets/Icons/svg/gmail_icon.svg";
import EventHandler from "./EventHandler";

const Event = ({ ele, handleEdit, setList, isOthers = false }) => {
  const displayName = getCustomPartialDisplayName(ele.original_user_name);
  const { userSettings, loginUserData } = useAuth();
  const navigate = useNavigate();
  const token = useAuthToken();

  /**
   * Checks if the current user is the creator of a specific element.
   * @returns {boolean} - True if the current user is the creator, false otherwise.
   */
  const isCreatedUser = () => {
    if (loginUserData?.user_id === ele?.original_user_id) {
      return true;
    }
    return false;
  };

  /**
   * Handles the deletion of an event.
   * @param {Object} ele - The event object to be deleted.
   * @returns None
   */
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
          toast.remove("rawcaster");
          toast.success("Event Deleted Successfully !", { id: "rawcaster" });
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.message, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Checks if a given date and time is not expired.
   * @returns {boolean} - Returns true if the date and time is not expired, false otherwise.
   */
  const isNotExpired = () => {
    const momenttimezone = require("moment-timezone");
    const currentTime = momenttimezone.utc().format("YYYY-MM-DD HH:mm:ss");
    if (moment(ele.start_date_time).isBefore(currentTime)) {
      return false;
    }
    return true;
  };

  /**
   * Generates an invite link based on the current window location and event details.
   * @returns {string} - The invite link.
   */
  const getInviteLink = () => {
    return (
      window.location.origin +
      generatePath(`/join/:event/:ref_id`, {
        event: ele?.type === 2 ? "talkshow" : "event",
        ref_id: ele?.reference_id || "",
      })
    );
  };

  /**
   * Generates a share message for inviting users to a web event.
   * @param {string} ele.original_user_name - The name of the user sending the invitation.
   * @param {string} ele.event_name - The name of the web event.
   * @param {string} ele.start_date_time - The start date and time of the web event in UTC format.
   * @param {string} userSettings?.time_zone - The time zone of the user.
   * @returns {string} The share message with the invitation details.
   */
  const shareMessage = `Hi,\n ${
    ele.original_user_name
  } is inviting you to join a web event called ${ele.event_name} on ${
    shareEventDate(
      utctoUserTimezone(ele.start_date_time, userSettings?.time_zone)
    ) + utctoUserTimezonewithAbbr(ele.start_date_time, userSettings?.time_zone)
  }. The link for this Rawcaster event is :`;

  const shareUrl = getInviteLink();
  const subject = "Rawcaster Event Invitation";

  /**
   * Generates a JSX element for displaying social media share buttons.
   * @param {string} shareMessage - The message to be shared on social media.
   * @param {string} shareUrl - The URL to be shared on social media.
   * @returns A JSX element containing social media share buttons for Facebook, Twitter, Gmail, and WhatsApp.
   */
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
        <a
          className="video-email_button button-hover"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=?&su=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(shareMessage)} ${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
        >
          <img src={GmailIcon} alt="Facebook"></img>
        </a>
        {/* <EmailShareButton
          subject={"Rawcaster Event Invite"}
          body={shareMessage}
          url={shareUrl}
        >
          <img src={GmailIcon} alt="Facebook"></img>
        </EmailShareButton> */}
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
            {isCreatedUser() && (
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
          <p className={classes.host}>Hosted by {decodeHtml(displayName)}</p>
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
        {/* {isNotExpired() && ( */}
        <EventHandler
          isHost={isCreatedUser()}
          title={ele.type === 2 ? "Talkshow" : "Event"}
          meetingId={ele.event_id}
          ele={ele}
        />
        {/* )} */}
      </div>
    </div>
  );
};

export default Event;
