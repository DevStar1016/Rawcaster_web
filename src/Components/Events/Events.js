import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { listEventsService } from "../../Services/ApiService";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../Shared/Utility";
import Event from "../../Sharedcomponents/Events/Event";
import BeforeAuthEvents from "./BeforeAuthEvents";
import AddLiveEvent from "./Configure/AddLiveEvent";
import CreateEvent from "./CreateEvent";
import classes from "./Events.module.css";

const Events = () => {
  const loginUserData = useAuthData();
  const token = useAuthToken();
  const [EventListData, setEventListData] = useState();
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);
  const [TalkShowData, setTalkShowData] = useState();

  const getEvents = () => {
    let eventData = {
      token: token,
      event_type: 1,
      page_number: 1,
    };
    listEventsService(JSONtoformdata(eventData))
      .then((res) => {
        if (res.data.status === 1) {
          setEventListData(res.data.events_list);
        } else {
          setEventListData([]);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (token) {
      getEvents();
    }
  }, [token, isTalkshowOpen]);

  const getValidEvent = () => {
    if (EventListData && EventListData.length !== 0) {
      const filteredArr = EventListData.reduce((acc, current) => {
        const x = acc.find((item) => item.event_id === current.event_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      return filteredArr;
    } else {
      return [];
    }
  };

  return (
    <div className={classes.eventSec}>
      {/* BEFORE LOGIN START */}
      {loginUserData === null ? (
        <BeforeAuthEvents />
      ) : (
        <>
          <div className={`${classes.beforelogin} mb-3`}>
            <Link className={classes.active}>
              <span class="material-icons">home</span> For You
            </Link>
            <Link aria-disabled>
              <span class="material-icons">people</span> Following
            </Link>
          </div>
          <CreateEvent />

          {getValidEvent().map((ele) => (
            <Event
              ele={ele}
              handleEdit={(ele) => {
                setTalkShowData(ele);
                setisTalkshowOpen(true);
              }}
            />
          ))}
          <AddLiveEvent
            data={TalkShowData}
            isTalkshowOpen={isTalkshowOpen}
            setisTalkshowOpen={setisTalkshowOpen}
          />
        </>
      )}
      {/* END */}
    </div>
  );
};

export default Events;
