import { useState } from "react";
import classes from "./EventSuccess.module.css";
import {
  handleCopyText,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../../Shared/Utility";
import { Tooltip } from "antd";
import { useAddEventContext } from "../../../Shared/Context";
import { generatePath } from "react-router";
import { useAuth } from "../../../Shared/Reduxfetcher";
import moment from "moment";

const EventSuccessPage = () => {
  const { userSettings } = useAuth();
  const [isCopied, setisCopied] = useState(false);
  const { EventData } = useAddEventContext();

  /**
   * Generates an invite link based on the web base url and event data.
   * @returns {string} - The invite link.
   */
  const getInviteLink = () => {
    return (
      window.location.origin +
      generatePath(`/join/:event/:ref_id`, {
        event: EventData?.type === 2 ? "talkshow" : "event",
        ref_id: EventData?.reference_id || "",
      })
    );
  };

  return (
    <div className={classes.SuccessContainer}>
      <h2>Your {EventData?.type === 2 ? "Talkshow" : "Event"} Has Been Scheduled !</h2>
      <div className={classes.ScheduleSec}>
        <h3>{EventData?.event_name}</h3>
        <p>
          {" "}
          {moment(
            utctoUserTimezone(
              EventData.start_date_time,
              userSettings?.time_zone
            )
          ).format("DD MMM YYYY")}
          {" . "}
          {moment(
            utctoUserTimezone(
              EventData.start_date_time,
              userSettings?.time_zone
            )
          ).format("hh:mm A") +
            " - (" +
            utctoUserTimezonewithAbbr(
              EventData.start_date_time,
              userSettings?.time_zone
            ) +
            ")"}
        </p>
        <div className={classes.MeetingLinkSec}>
          <p> {getInviteLink()}</p>
          <Tooltip placement="top" title={"Copy"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {isCopied ? (
                <span className={`material-symbols-rounded`}>done</span>
              ) : (
                <span
                  class="material-symbols-outlined"
                  onClick={() => {
                    handleCopyText(getInviteLink()).then(() => {
                      setisCopied(true);
                    });
                  }}
                >
                  content_copy
                </span>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default EventSuccessPage;
