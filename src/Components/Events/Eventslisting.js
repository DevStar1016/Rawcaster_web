import { Button, Dropdown, Empty, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { listEventsService } from "../../Services/ApiService";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { JSONtoformdata, decodeHtml } from "../../Shared/Utility";
import Event from "../../Sharedcomponents/Events/Event";
import AddTalkshow from "./Configure/AddTalkshow";
import CreateEvent from "./CreateEvent";
import classes from "./Events.module.css";
import { DropdownItems, UserDropdownItems } from "./Configure/Constants";
import AddEvent from "./Configure/AddEvent";
import { EventContext } from "../../Shared/Context";
import EventLoaders from "../Loaders/EventLoaders";

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
  const [EnableEvents, setEnableEvents] = useState(false);

  /**
   * Retrieves a list of events based on the specified event type.
   * @param {number} [event_type=0] - The type of event to retrieve. Defaults to 0.
   * @returns None
   */
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
      .catch((err) => {})
      .finally(() => {
        setisFetching(false);
        setEnableEvents(true);
      });
  };

  /**
   * Executes a side effect when the dependencies change.
   * If the loginUserData is not null and there is a token,
   * it calls the getEvents function with the ActiveEvent key.
   * @param {Function} getEvents - The function to call when the dependencies change.
   * @param {any} loginUserData - The user data obtained after login.
   * @param {string} token - The authentication token.
   * @param {boolean} isTalkshowOpen - The flag indicating if the talkshow is open.
   * @param {boolean} isSuccess - The flag indicating if the operation was successful.
   * @returns None
   */
  useEffect(() => {
    if (loginUserData !== null) {
      if (token) {
        getEvents(ActiveEvent.key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isTalkshowOpen, isSuccess]);

  /**
   * Determines the appropriate dropdown list based on the value of `isUser`.
   * If `isUser` is true, the `UserDropdownItems` list is used. Otherwise, the `DropdownItems` list is used.
   * @param {boolean} isUser - Indicates whether the dropdown list should be for a user or not.
   * @returns The appropriate dropdown list based on the value of `isUser`.
   */
  const Dropdownlist = isUser ? UserDropdownItems : DropdownItems;

  return (
    <EventContext.Provider
      value={{
        getEvents,
        ActiveEvent,
        isCreateEnabled,
        EventListData,
        setEventListData,
      }}
    >
      <>
        {EnableEvents && (
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
        )}

        {EnableEvents && (
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
                <i className="material-symbols-outlined">expand_more</i>
              </div>
            </Dropdown>
          </div>
        )}
        <div className="d-flex flex-column">
          {isFetching ? (
            <div className="mt-5 d-flex flex-column justify-content-center">
              {[...new Array(3)].map((ele) => {
                return <EventLoaders />;
              })}
            </div>
          ) : (
            <div
              style={EventListData?.length === 0 ? { height: "inherit" } : {}}
              className={classes.EventListSec}
            >
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
                <div className={classes.noeventfound}>
                  <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{ height: 80 }}
                    description={<p className="pt-1">No Events Found</p>}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {isEventOpen && (
          <AddEvent
            isEventOpen={isEventOpen}
            setisEventOpen={setisEventOpen}
            data={EventData}
          />
        )}
        {isTalkshowOpen && (
          <AddTalkshow
            data={EventData}
            isTalkshowOpen={isTalkshowOpen}
            setisTalkshowOpen={setisTalkshowOpen}
          />
        )}
      </>
    </EventContext.Provider>
  );
};

export default Eventslisting;
