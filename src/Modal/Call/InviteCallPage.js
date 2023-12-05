import { useEffect, useState } from "react";
import classes from "./InviteCall.module.css";
import { handleCopyText, utctoUserTimezone, utctoUserTimezonewithAbbr } from "../../Shared/Utility";
import { Tooltip } from "antd";
import { generatePath } from "react-router";
import { useAuth } from "../../Shared/Reduxfetcher";
import moment from "moment";
import { Modal } from "antd";

const InviteCallPage = (props) => {
  const { userSettings } = useAuth();
  const [open, setOpen] = useState(false);
  const [isCopied, setisCopied] = useState(false);
  const { sender_id,  sender_name, meeting_id, meeting_link, meeting_type } = props.senderData;

  useEffect(() => {
    console.log('props:--', props);
    setOpen(props.open);
  }, []);

  return (
    <Modal open={open}>
      <div className={classes.SuccessContainer}>
      <h2>{props.senderData?.sender_name} is calling you to {props.senderData?.meeting_type} call</h2>
      <div className={classes.ScheduleSec}>
        <h3>{props.senderData?.meeting_id}</h3>
        <p>
          {" "}
          {moment(
            utctoUserTimezone(
              new Date(),
              userSettings?.time_zone
            )
          ).format("DD MMM YYYY")}
          {" . "}
          {moment(
            utctoUserTimezone(
              new Date(),
              userSettings?.time_zone
            )
          ).format("hh:mm A") +
            " - (" +
            utctoUserTimezonewithAbbr(
              new Date(),
              userSettings?.time_zone
            ) +
            ")"}
        </p>
        <div className={classes.MeetingLinkSec}>
          <p> {props.senderData.meeting_link}</p>
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
                  className="material-symbols-outlined"
                  onClick={() => {
                    handleCopyText(props.senderData.meeting_link).then(() => {
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
    </Modal>
  );
};

export default InviteCallPage;
