import React, { useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router";
import { viewEventsService } from "../../Services/ApiService";
import {
  decodeHtml,
  eventDisplayDuration,
  handleCopyText,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../Shared/Utility";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import classes from "./viewevent.module.css";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import Seo from "../SEO/Seo";
import { EventSEO } from "../SEO/SEOContent";
import { Tooltip } from "antd";

const Viewevent = () => {
  const { userSettings } = useAuth();
  const [ViewEventData, setViewEventData] = useState();
  const [isCopied, setisCopied] = useState(false);
  const token = useAuthToken();
  const { event_id } = useParams();
  const navigate = useNavigate();

  /**
   * Executes a side effect when the dependencies `event_id` and `token` change.
   * If `token` is truthy, it sets the view event data, creates a new `FormData` object,
   * appends the `token` and `event_id` to the form data, and calls the `viewEventsService`
   * function with the form data. If the response status is 1, it sets the `viewEventData`
   * state with the event details from the response. Otherwise, it navigates back one page.
   * If there is an error, it also navigates back one page.
   * @returns None
   */
  useEffect(() => {
    if (token) {
      setViewEventData();
      let formData = new FormData();
      formData.append("token", token);
      formData.append("event_id", event_id);
      viewEventsService(formData)
        .then((response) => {
          if (response.data.status === 1) {
            const eventdetails = response.data.event_detail;
            setViewEventData(eventdetails);
          } else {
            navigate(-1);
          }
        })
        .catch((error) => {
          navigate(-1);
        });
    }
  }, [event_id, token]);

  const getInviteLink = () => {
    return (
      window.location.origin +
      generatePath(`/join/:event/:ref_id`, {
        event: ViewEventData?.type === 2 ? "talkshow" : "event",
        ref_id: ViewEventData?.reference_id || "",
      })
    );
  };
  return (
    <div className={classes.eventContainer}>
      <Seo
        title={
          EventSEO(
            ViewEventData?.event_name
              ? decodeHtml(ViewEventData.event_name)
              : "Event"
          ).title
        }
        description={
          EventSEO(
            ViewEventData?.event_name
              ? decodeHtml(ViewEventData.event_name)
              : "Event"
          ).description
        }
      />
      {ViewEventData ? (
        <div className={classes.eventCard}>
          <div className={classes.eventTitle}>
            <h2>{decodeHtml(ViewEventData.event_name)}</h2>
          </div>
          <p className={classes.eventDate}>
            {moment(
              utctoUserTimezone(
                ViewEventData.start_date_time,
                userSettings?.time_zone
              )
            ).format("DD MMM YYYY")}
            {" . "}
            {moment(
              utctoUserTimezone(
                ViewEventData.start_date_time,
                userSettings?.time_zone
              )
            ).format("hh:mm A") +
              " - (" +
              utctoUserTimezonewithAbbr(
                ViewEventData.start_date_time,
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
          <div className={classes.eventBanner}>
            <img
              src={ViewEventData.banner_image}
              alt={decodeHtml(ViewEventData.event_name)}
            ></img>
          </div>

          {ViewEventData?.type === 1 && (
            <div className={classes.eventDetail}>
              <p>
                Maximun Participants : {ViewEventData.no_of_participants} |
                Total Duration : {eventDisplayDuration(ViewEventData.duration)}
              </p>
            </div>
          )}
          <div className={classes.eventMes}>
            <p>{ViewEventData.message}</p>
          </div>
          <div>
            <div className={classes.eventHost}>
              <img
                src={ViewEventData.original_user_image}
                alt={decodeHtml(ViewEventData.original_user_name)}
              />
              <Tooltip
                placement="bottom"
                title={decodeHtml(ViewEventData.original_user_name)}
              >
                <div className={classes.user_name}>
                  {decodeHtml(ViewEventData.original_user_name)?.length > 25
                    ? `${decodeHtml(ViewEventData.original_user_name)?.slice(
                        0,
                        22
                      )}...`
                    : decodeHtml(ViewEventData.original_user_name)}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.LoadingSec}>
          <Spinner animation="border" color="#563662" />
        </div>
      )}
    </div>
  );
};

export default Viewevent;
