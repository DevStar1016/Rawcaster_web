import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import { useDashboard } from "../../Shared/Reduxfetcher";
import {
  globalSearchEventsService,
  searchRawcasterUsersService,
} from "../../Services/ApiService";
import axios from "axios";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import {
  getAuthenticated,
  getAuthToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { getLocalStorageData } from "../../Store/Storage";
import { toast } from "react-hot-toast";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Spinner } from "react-bootstrap";
import Event from "../../Sharedcomponents/Events/Event";
import classes from "./GlobalSearch.module.css";

let isRequestCancel = false;

const EventsList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [EventList, setEventList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isFetching, setisFetching] = useState(true);
  const [Pages, setPages] = useState({
    page: 1,
    totalpage: 1,
  });

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = JSON.parse(getLocalStorageData("rawcaster_user_token"));
      return userData?.token;
    } else {
      return "RAWCAST";
    }
  };

  const getEventList = (page = 1) => {
    if (source.current) {
      isRequestCancel = true;
      source.current.cancel("Request Cancelled");
    }
    source.current = axios.CancelToken.source();
    let nuggetData = {
      token: getToken(),
      search_key: params.key,
      page_number: page,
    };
    globalSearchEventsService(JSONtoformdata(nuggetData), source.current.token)
      .then((res) => {
        if (res.data.status === 1) {
          console.log("test");
          if (res.data.current_page_no === 1) {
            setEventList(res.data.events_list);
          } else {
            setEventList((pre) =>
              [...pre, ...res.data.events_list].reduce((acc, current) => {
                const x = acc.find(
                  (item) => item.event_id === current.event_id
                );
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, [])
            );
          }
          setPages({
            page: res.data.current_page_no,
            totalpage: res.data.total_pages,
          });
        } else {
          setEventList([]);
        }
      })
      .catch((err) => {
        if (!isRequestCancel || !err.message.includes("Request Cancelled")) {
          toast.error(err.message);
        }
      })
      .finally(() => {
        setisLoading(false);
        dispatch(handleLoading(false));
        dispatch(handleisGlobalSearch(false));
        setisFetching(false);
      });
  };

  useEffect(() => {
    if (isGlobalSearch || EventList?.length === 0) {
      dispatch(handleLoading(true));
      setisFetching(true);
      getEventList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isGlobalSearch]);

  const onEndReached = () => {
    console.log("test");
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);

      getEventList(Pages.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);
  console.log(EventList);
  const getValidEvent = () => {
    if (EventList && EventList.length !== 0) {
      const filteredArr = EventList.reduce((acc, current) => {
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
    <>
      {getValidEvent()?.length === 0 ? (
        <>
          {isFetching ? (
            <div className="mt-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <span style={{ fontSize: 20, fontWeight: "bold" }} className="mt-3">
              We didn't find any results
            </span>
          )}
        </>
      ) : null}
      <div className={` ${classes.profileSec}`} ref={scrollRef}>
        {getValidEvent()?.length !== 0 && (
          <>
            {isFetching ? (
              <div className="mt-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                {getValidEvent().map((ele) => (
                  <Event ele={ele} />
                ))}
              </>
            )}
          </>
        )}
        {isLoading && (
          <div className="text-center py-2">
            <Spinner animation="border" role="status" />
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
