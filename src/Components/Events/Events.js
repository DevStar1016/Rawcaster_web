import { Dropdown, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { listEventsService } from "../../Services/ApiService";
import {
  useAuthData,
  useAuthToken,
  useDashboard,
} from "../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../Shared/Utility";
import Event from "../../Sharedcomponents/Events/Event";
import { handleDashboardFilterType } from "../../Store/Redux/Reducer/DashboardReducer";
import BeforeAuthEvents from "./BeforeAuthEvents";
import AddLiveEvent from "./Configure/AddLiveEvent";
import CreateEvent from "./CreateEvent";
import classes from "./Events.module.css";

const Events = () => {
  const dispatch = useDispatch();
  const loginUserData = useAuthData();
  const token = useAuthToken();
  const { DashboardfilterType } = useDashboard();
  const [EventListData, setEventListData] = useState();
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);
  const [TalkShowData, setTalkShowData] = useState();
  const [ActiveEvent, setActiveEvent] = useState({
    value: "Public Events",
    key: 3,
  });
  const [isFetching, setisFetching] = useState(true);

  const getEvents = (event_type = 3) => {
    let eventData = {
      token: token,
      event_type: event_type,
      page_number: 1,
    };
    console.log(eventData, "==>Events");
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
      })
      .finally(() => {
        setisFetching(false);
      });
  };

  useEffect(() => {
    if (loginUserData !== null) {
      if (token) {
        getEvents(ActiveEvent.key);
      }
    }
  }, [token, isTalkshowOpen]);

  // const getValidEvent = () => {
  //   if (EventListData && EventListData.length !== 0) {
  //     const filteredArr = EventListData.reduce((acc, current) => {
  //       const x = acc.find((item) => item.event_id === current.event_id);
  //       if (!x) {
  //         return acc.concat([current]);
  //       } else {
  //         return acc;
  //       }
  //     }, []);
  //     return filteredArr;
  //   } else {
  //     return [];
  //   }
  // };

  return (
    <div className={classes.eventSec}>
      {/* BEFORE LOGIN START */}
      {loginUserData === null ? (
        <BeforeAuthEvents />
      ) : (
        <>
          <div className={`${classes.beforelogin} mb-3`}>
            <Link
              className={DashboardfilterType === 0 ? classes.active : ""}
              onClick={() => {
                dispatch(handleDashboardFilterType(0));
              }}
            >
              <span class="material-icons">home</span> For You
            </Link>
            <Link
              className={DashboardfilterType === 1 ? classes.active : ""}
              onClick={() => {
                dispatch(handleDashboardFilterType(1));
              }}
            >
              <span class="material-icons">people</span> Following
            </Link>
          </div>
          <CreateEvent />

          <div className={classes.filterSec}>
            <p>Future Events</p>
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div
                        onClick={() => {
                          setisFetching(true);
                          getEvents(3);
                          setActiveEvent({ value: "Public Events", key: 3 });
                        }}
                      >
                        Public Events
                      </div>
                    ),
                    key: "0",
                  },
                  {
                    type: "divider",
                  },
                  {
                    label: (
                      <div
                        onClick={() => {
                          setisFetching(true);
                          getEvents(1);
                          setActiveEvent({ value: "My Events", key: 1 });
                        }}
                      >
                        My Events
                      </div>
                    ),
                    key: "1",
                  },
                ],
              }}
              trigger={["click"]}
            >
              <div className={classes.dropmenu}>
                <span>{ActiveEvent.value}</span>
                <i class="material-symbols-outlined">expand_more</i>
              </div>
            </Dropdown>
          </div>

          {isFetching ? (
            <div className="mt-5 d-flex flex-row justify-content-center">
              <Skeleton loading={true} active avatar />
            </div>
          ) : (
            <>
              {EventListData?.map((ele) => (
                <Event
                  ele={ele}
                  ActiveEvent={ActiveEvent}
                  handleEdit={(ele) => {
                    setTalkShowData(ele);
                    setisTalkshowOpen(true);
                  }}
                />
              ))}
            </>
          )}
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
