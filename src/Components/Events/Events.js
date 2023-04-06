import { Dropdown, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { listEventsService } from "../../Services/ApiService";
import {
  useAuth,
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
  const { isSuccess } = useAuth();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isTalkshowOpen, isSuccess]);

  return (
    <div className={classes.eventSec}>
      {/* BEFORE LOGIN START */}
      {loginUserData === null && isSuccess ? (
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
                          getEvents(2);
                          setActiveEvent({ value: "Invited Events", key: 2 });
                        }}
                      >
                        Invited Events
                      </div>
                    ),
                    key: "1",
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
                    key: "2",
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
