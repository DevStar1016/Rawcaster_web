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
  DecryptionString,
  getAuthenticated,
  getAuthToken,
  getRawcaserToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { getCookieData } from "../../Store/Storage";
import { toast } from "react-hot-toast";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Col, Row, Spinner } from "react-bootstrap";
import Event from "../../Sharedcomponents/Events/Event";
import classes from "./GlobalSearch.module.css";
import { Skeleton } from "antd";
import EventLoaders from "../Loaders/EventLoaders";

let isRequestCancel = false;

const EventsList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
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
        // dispatch(handleisGlobalSearch(false));
        setisFetching(false);
      });
  };

  useEffect(() => {
    if (isGlobalSearch || EventList?.length === 0) {
      console.log("testttttt");
      dispatch(handleLoading(true));
      setisFetching(true);
      getEventList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onEndReached = () => {
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);
      getEventList(Pages.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

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
      {isFetching ? (
        <div className="mt-5 W-100">
          <Skeleton active />
        </div>
      ) : (
        <div className={` ${classes.profileSec} w-100`} ref={scrollRef}>
          {getValidEvent()?.length === 0 ? (
            <div className="mt-3" style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
                className="mt-3"
              >
                We didn't find any results
              </span>
            </div>
          ) : (
            <>
              <Row>
                {getValidEvent().map((ele) => (
                  <Col sm={6}>
                    <Event ele={ele} />
                  </Col>
                ))}
              </Row>
              {isLoading && (
                <div className="text-center py-2">
                  <Spinner animation="border" role="status" />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EventsList;
