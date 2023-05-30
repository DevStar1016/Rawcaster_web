import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { viewEventsService } from "../../Services/ApiService";
import {
  decodeHtml,
  eventDisplayDuration,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../Shared/Utility";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import classes from "./viewevent.module.css";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import Seo from "../SEO/Seo";
import { EventSEO } from "../SEO/SEOContent";

const Viewevent = () => {
  const { userSettings } = useAuth();
  const [ViewEventData, setViewEventData] = useState();
  const token = useAuthToken();
  const { event_id } = useParams();
  const navigate = useNavigate();

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
          <div className={classes.eventBanner}>
            <img
              src={ViewEventData.banner_image}
              alt={decodeHtml(ViewEventData.event_name)}
            ></img>
          </div>

          <div className={classes.eventDetail}>
            <p>
              Maximun Participants : {ViewEventData.no_of_participants} | Total
              Duration : {eventDisplayDuration(ViewEventData.duration)}
            </p>
          </div>
          <div className={classes.eventMes}>
            <p>{ViewEventData.message}</p>
          </div>

          <div className={classes.eventHost}>
            <div>
              <img
                src={ViewEventData.original_user_image}
                alt={decodeHtml(ViewEventData.original_user_name)}
              ></img>
            </div>
            <div className={classes.user_name}>
              {decodeHtml(ViewEventData.original_user_name)}
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
