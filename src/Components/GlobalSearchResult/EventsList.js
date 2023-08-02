import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { globalSearchEventsService } from "../../Services/ApiService";
import axios from "axios";
import {
  DecryptionString,
  getAuthenticated,
  getRawcaserToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { Col, Row, Spinner } from "react-bootstrap";
import Event from "../../Sharedcomponents/Events/Event";
import classes from "./GlobalSearch.module.css";
import { Empty, Skeleton } from "antd";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { ChimesocketListen } from "../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";

let isRequestCancel = false;

const EventsList = () => {
  const containerRef = useRef();
  const pageRef = useRef(1);
  const dispatch = useDispatch();
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [EventList, setEventList] = useState([]);
  const [isFetching, setisFetching] = useState(true);
  const [loading, setloading] = useState(false);
  const [Pages, setPages] = useState({
    page: null,
    totalpage: null,
  });

  useEffect(() => {
    ChimesocketListen.on("connect", () => {
      console.log(ChimesocketListen.connected, "Chime Socket");
    });
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM, (message) => {
      console.log(message, "CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM");
    });
  }, []);

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = getRawcaserToken();
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
      search_key: searchKey,
      page_number: page,
    };
    globalSearchEventsService(JSONtoformdata(nuggetData), source.current.token)
      .then((res) => {
        if (res.data.status === 1) {
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
          pageRef.current = res.data.current_page_no;
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
        dispatch(handleLoading(false));
        setloading(false);
        // dispatch(handleisGlobalSearch(false));
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
  }, [pathname]);

  const getHasNextPage = () => {
    return Pages.totalpage && pageRef.current !== Pages.totalpage;
  };

  const loadMore = () => {
    if (!getHasNextPage()) {
      setloading(false);
    } else if (getHasNextPage() && !loading) {
      setloading(true);
      pageRef.current = pageRef.current + 1;
      getEventList(pageRef.current);
    }
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

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

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        console.log("Reached End");
        // User has reached the bottom (with a 10px threshold)
        // Perform your desired action here, e.g., fetch more data
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      {isFetching ? (
        <div className="mt-5 W-100">
          <Skeleton active />
        </div>
      ) : (
        <div className={` ${classes.profileSec} w-100`}>
          {getValidEvent()?.length === 0 ? (
            <div className={classes.DisplayMsg}>
              <Empty description=" We didn't find any results" />
            </div>
          ) : (
            <div ref={[rootRef, containerRef]}>
              <Row>
                {getValidEvent().map((ele) => (
                  <Col sm={6}>
                    <Event ele={ele} />
                  </Col>
                ))}
              </Row>
              {(loading || getHasNextPage()) && (
                <div className="text-center py-2" ref={sentryRef}>
                  <Spinner animation="border" role="status" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventsList;
