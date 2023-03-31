import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from "./Nuggets.module.css";
import { useDispatch } from "react-redux";
import { listNuggetsService } from "../../Services/ApiService";
import {
  DecryptionString,
  detectMob,
  getAuthenticated,
  JSONtoformdata,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import dayjs from "dayjs";
import PostNuggets from "./PostNuggets";
import { getLocalStorageData } from "../../Store/Storage";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { Spinner } from "react-bootstrap";
import { ListNuggetContext } from "../../Shared/Context";
import axios from "axios";
import PostProgress from "./PostProgress";
import Post from "./Post";
import { useParams } from "react-router";
import { useAuthData, useDashboard } from "../../Shared/Reduxfetcher";
import { Skeleton } from "antd";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

let isRequestCancel = false;

const Nuggets = () => {
  const source = useRef(null);
  const params = useParams();
  const userData = JSON.parse(getLocalStorageData("rawcaster_user_token"));
  const loginUserData = useAuthData();
  const display_user_id = params?.user_id
    ? DecryptionString(params?.user_id)
    : null;
  const { DashboardfilterType } = useDashboard();
  const [filterType, setfilterType] = useState(0);
  const [muted, setmuted] = useState(false);
  const dispatch = useDispatch();
  const [Progress, setProgress] = useState({
    percent: 0,
    show: false,
  });
  const pageRef = useRef({
    page: 1,
    totalpage: 1,
  });
  const [isFetching, setisFetching] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [NuggetList, setNuggetList] = useState([]);
  const [isEdit, setisEdit] = useState(null);
  const [Pages, setPages] = useState({
    page: 1,
    totalpage: 1,
  });

  const getToken = () => {
    if (getAuthenticated() && loginUserData) {
      return loginUserData?.token;
    } else {
      return "RAWCAST";
    }
  };

  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;
    setProgress({
      percent: Math.round(val),
      show: true,
    });
  };

  const getNuggetList = (page = 1, filter_type) => {
    let promise = new Promise((resolve, reject) => {
      if (source.current) {
        isRequestCancel = true;
        source.current.cancel("Request Cancelled");
      }
      source.current = axios.CancelToken.source();
      let nuggetData = {
        nugget_type: 0,
        token: getToken(),
        page_number: page,
        filter_type: filter_type ? filter_type : DashboardfilterType,
      };
      setfilterType(DashboardfilterType);

      if (params.key) {
        nuggetData = {
          ...nuggetData,
          search_key: params.key,
        };
      }
      if (display_user_id) {
        nuggetData = {
          ...nuggetData,
          user_id: display_user_id,
        };
      }

      listNuggetsService(JSONtoformdata(nuggetData), source.current.token)
        .then((res) => {
          if (res.data.status === 1) {
            resolve(res.data);
            if (res.data.current_page_no === 1) {
              setNuggetList(res.data.nuggets_list);
            } else {
              setNuggetList((pre) =>
                [...pre, ...res.data.nuggets_list].reduce((acc, current) => {
                  const x = acc.find(
                    (item) => item.nugget_id === current.nugget_id
                  );
                  if (!x) {
                    return acc.concat([current]);
                  } else {
                    return acc;
                  }
                }, [])
              );
            }
            pageRef.current = {
              page: res.data.current_page_no,
              totalpage: res.data.total_pages,
            };
            setPages({
              page: res.data.current_page_no,
              totalpage: res.data.total_pages,
            });
          } else {
            setNuggetList([]);
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
          setisFetching(false);
        });
    });

    return promise;
  };

  useEffect(() => {
    if (NuggetList.length === 0) {
      getNuggetList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.key) {
      getNuggetList(1, 0);
    } else if (DashboardfilterType !== filterType) {
      getNuggetList();
    } else if (display_user_id) {
      getNuggetList();
    }
  }, [params, DashboardfilterType, display_user_id]);

  const onEndReached = () => {
    if (pageRef.current.page !== pageRef.current.totalpage) {
      getNuggetList(pageRef.current.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  const ListNuggetData = {
    NuggetList,
    setProgress,
    setNuggetList,
    Pages,
    setPages,
    setisEdit,
    isEdit,
    getProgress() {
      return Progress;
    },
    async getNuggetList() {
      return await getNuggetList();
    },
    handleProgress(val) {
      return handleProgress(val);
    },
  };

  const getValidNuggets = () => {
    const filteredArr = NuggetList.reduce((acc, current) => {
      const x = acc.find((item) => item.nugget_id === current.nugget_id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return filteredArr;
  };

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && detectMob()) {
      onEndReached();
    }
  };
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDisplayPost = () => {
    if (getAuthenticated()) {
      if (parseInt(display_user_id) === parseInt(userData?.user_id)) {
        return true;
      } else if (!display_user_id) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      <div
        className={params.key ? classes.resultnuggetSec : classes.nuggetSec}
        ref={scrollRef}
      >
        <>
          {isDisplayPost() && (
            <>
              {Progress.show ? (
                <PostProgress />
              ) : (
                <PostNuggets getNuggetList={getNuggetList} />
              )}
            </>
          )}
        </>

        {getValidNuggets()?.length === 0 && (
          <div className="mt-3">
            {isFetching ? (
              <>
                {[...Array(6)].map(() => (
                  <Skeleton loading={isFetching} active avatar />
                ))}{" "}
              </>
            ) : (
              <span
                style={{ fontSize: 20, fontWeight: "bold" }}
                className="mt-3"
              >
                {params.key
                  ? "We didn't find any results"
                  : isDisplayPost()
                  ? "No Posts Available"
                  : "Share Your First Nugget"}
              </span>
            )}
          </div>
        )}
        {getValidNuggets()?.length !== 0 && (
          <>
            {isFetching ? (
              <div className="mt-5">
                <Skeleton loading={isFetching} active avatar />
              </div>
            ) : (
              <>
                {NuggetList?.map((ele, index) => {
                  return (
                    <Post
                      ele={ele}
                      index={index}
                      getList={getNuggetList}
                      muted={muted}
                      setmuted={setmuted}
                      handleView={() => {
                        let findIndex = NuggetList.findIndex(
                          (elem) => elem.nugget_id === ele.nugget_id
                        );
                        let tempData = [...NuggetList];
                        if (tempData[findIndex].viewed !== 1) {
                          tempData[findIndex].total_views =
                            tempData[findIndex].total_views + 1;
                        }
                        tempData[findIndex].viewed = 1;
                        setNuggetList(tempData);
                      }}
                      handleLike={(like) => {
                        let findIndex = NuggetList.findIndex(
                          (elem) => elem.nugget_id === ele.nugget_id
                        );
                        let tempData = [...NuggetList];
                        tempData[findIndex].liked = like === 1 ? true : false;
                        tempData[findIndex].total_likes =
                          like === 1
                            ? tempData[findIndex].total_likes + 1
                            : tempData[findIndex].total_likes - 1;
                        setNuggetList(tempData);
                      }}
                      handleSave={(save) => {
                        let findIndex = NuggetList.findIndex(
                          (elem) => elem.nugget_id === ele.nugget_id
                        );
                        let tempData = [...NuggetList];
                        tempData[findIndex].saved = save === 1 ? true : false;

                        setNuggetList(tempData);
                      }}
                      onEdit={(id) => {
                        setisEdit(id);
                      }}
                      HandleShare={() => {
                        console.log("share");
                      }}
                    />
                  );
                })}
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
    </ListNuggetContext.Provider>
  );
};

export default Nuggets;
