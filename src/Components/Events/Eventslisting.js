import { Dropdown, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { listEventsService } from "../../Services/ApiService";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { JSONtoformdata, decodeHtml } from "../../Shared/Utility";
import Event from "../../Sharedcomponents/Events/Event";
import AddLiveEvent from "./Configure/AddLiveEvent";
import CreateEvent from "./CreateEvent";
import classes from "./Events.module.css";
import { DropdownItems, UserDropdownItems } from "./Configure/Constants";
import AddEvent from "./Configure/AddEvent";
import { EventContext } from "../../Shared/Context";

const Eventslisting = ({
  isSearchEnabled = false,
  isUser = false,
  userData,
  isCreateEnabled = true,
}) => {
  const loginUserData = useAuthData();
  const { isSuccess } = useAuth();
  const token = useAuthToken();
  const [EventListData, setEventListData] = useState();
  const [SearchData, setSearchData] = useState("");
  const [isEventOpen, setisEventOpen] = useState(false);
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);
  const [isEmptyEvents, setisEmptyEvents] = useState(false);
  const [EventData, setEventData] = useState();
  const [ActiveEvent, setActiveEvent] = useState({
    label: "Upcoming Events",
    key: 0,
  });
  const [isFetching, setisFetching] = useState(true);

  const getEvents = (event_type = 0) => {
    let eventData = {
      token: token,
      event_type: event_type,
      page_number: 1,
    };
    listEventsService(JSONtoformdata(eventData))
      .then((res) => {
        if (res.data.status === 1) {
          if (isUser) {
            let filterEventList = res.data.events_list.filter((ele) => {
              return ele.original_user_id === userData?.user_id;
            });
            setEventListData(filterEventList.reverse());
          } else {
            setEventListData(res.data.events_list.reverse());
          }
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

  const Dropdownlist = isUser ? UserDropdownItems : DropdownItems;

  return (
    <EventContext.Provider
      value={{
        getEvents,
        ActiveEvent,
        isCreateEnabled,
      }}
    >
      <>
        <CreateEvent
          isSearch={isSearchEnabled}
          onSearchEnter={(val) => {
            setSearchData(val);
            let findData = EventListData.find((ele) =>
              decodeHtml(ele.event_name)
                .toLowerCase()
                .includes(val.toLowerCase())
            );

            if (findData) {
              setisEmptyEvents(false);
            } else {
              setisEmptyEvents(true);
            }
          }}
        />

        <div className={classes.filterSec}>
          <p>{parseInt(ActiveEvent.key) === 4 ? "Past" : "Future"} Events</p>
          <Dropdown
            menu={{
              items: Dropdownlist,
              onClick: (e) => {
                let findValue = Dropdownlist.find(
                  (ele) => parseInt(ele.key) === parseInt(e.key)
                );
                if (findValue) {
                  setisFetching(true);
                  getEvents(findValue.key);
                  setActiveEvent(findValue);
                }
              },
            }}
            trigger={["click"]}
          >
            <div className={classes.dropmenu}>
              <span>{ActiveEvent.label}</span>
              <i class="material-symbols-outlined">expand_more</i>
            </div>
          </Dropdown>
        </div>

        {isFetching ? (
          <div className="mt-5 d-flex flex-row justify-content-center">
            {[...new Array(6)].map((ele) => {
              return <Skeleton loading={true} active avatar />;
            })}
          </div>
        ) : (
          <div className={classes.EventListSec}>
            {EventListData?.map((ele) => (
              <div
                style={{
                  display: decodeHtml(ele.event_name)
                    .toLowerCase()
                    .includes(SearchData.toLowerCase())
                    ? "block"
                    : "none",
                }}
              >
                <Event
                  ele={ele}
                  setList={setEventListData}
                  handleEdit={(ele) => {
                    setEventData(ele);
                    if (ele.type === 1) {
                      setisEventOpen(true);
                    } else if (ele.type === 2) {
                      setisTalkshowOpen(true);
                    }
                  }}
                />
              </div>
            ))}
            {(EventListData?.length === 0 || isEmptyEvents) && (
              <div className="text-center">No event found</div>
            )}
          </div>
        )}

        <AddEvent
          isEventOpen={isEventOpen}
          setisEventOpen={setisEventOpen}
          data={EventData}
        />
        <AddLiveEvent
          data={EventData}
          isTalkshowOpen={isTalkshowOpen}
          setisTalkshowOpen={setisTalkshowOpen}
        />
      </>
    </EventContext.Provider>
  );
};

export default Eventslisting;
