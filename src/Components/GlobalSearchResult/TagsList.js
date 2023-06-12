import { Dropdown, Empty, Skeleton } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import { TagsListService } from "../../Services/ApiService";
import { useDashboard } from "../../Shared/Reduxfetcher";
import {
  DecryptionString,
  getAuthenticated,
  getAuthToken,
  getRawcaserToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import TagsChart from "../../UIComponents/TagsChart";
import classes from "./GlobalSearch.module.css";
import useInfiniteScroll from "react-infinite-scroll-hook";

let isRequestCancel = false;

const TagsList = () => {
  const containerRef = useRef();
  const pageRef = useRef(1);
  const dispatch = useDispatch();
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [TagsList, setTagsList] = useState([]);
  const [isFetching, setisFetching] = useState(true);
  const [loading, setloading] = useState(false);
  const [isReachedEnd, setisReachedEnd] = useState(false);
  const [Pages, setPages] = useState({
    page: null,
    totalpage: null,
  });

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = getRawcaserToken();
      return userData?.token;
    } else {
      return "RAWCAST";
    }
  };
  const getTagsList = (page = 1) => {
    if (source.current) {
      isRequestCancel = true;
      source.current.cancel("Request Cancelled");
    }
    source.current = axios.CancelToken.source();
    let TagsData = {
      token: getToken(),
      auth_code: getAuthToken(getToken()),
      search_tag: searchKey,
      page_number: page,
    };
    TagsListService(JSONtoformdata(TagsData), source.current.token)
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.current_page_no === 1) {
            setTagsList(res.data.tags);
          } else {
            setTagsList((pre) =>
              [...pre, ...res.data.tags].reduce((acc, current) => {
                const x = acc.find((item) => item.tag === current.tag);
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
          setTagsList([]);
        }
      })
      .catch((err) => {
        if (!isRequestCancel || !err.message.includes("Request Cancelled")) {
          toast.error(err.message);
        }
      })
      .finally(() => {
        dispatch(handleLoading(false));
        dispatch(handleisGlobalSearch(false));
        setisFetching(false);
      });
  };

  useEffect(() => {
    if (isGlobalSearch || TagsList?.length === 0) {
      dispatch(handleLoading(true));
      getTagsList();
      setisFetching(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getHasNextPage = () => {
    return Pages.totalpage && pageRef.current !== Pages.totalpage;
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setisReachedEnd(true);
      }
    }
  };

  const loadMore = () => {
    if (!getHasNextPage()) {
      setloading(false);
      setisReachedEnd(false);
    } else if (isReachedEnd && getHasNextPage() && !loading) {
      setloading(true);
      pageRef.current = pageRef.current + 1;
      getTagsList(pageRef.current);
    }
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

  const getValidTags = () => {
    if (TagsList && TagsList.length !== 0) {
      const filteredArr = TagsList.reduce((acc, current) => {
        const x = acc.find((item) => item.tag === current.tag);
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
      {getValidTags()?.length === 0 ? (
        <>
          {isFetching ? (
            <div className="mt-5 w-100">
              {[...Array(6)].map((ele) => (
                <Skeleton active />
              ))}
            </div>
          ) : (
            <div className={classes.DisplayMsg}>
              <Empty description=" We didn't find any results" />
            </div>
          )}
        </>
      ) : null}

      {getValidTags()?.length === 0 ? (
        <div></div>
      ) : (
        <div
          ref={containerRef}
          className={`${classes.nuggetSec} ${classes.nopadding} w-100`}
        >
          {getValidTags()?.length !== 0 && (
            <>
              {isFetching ? (
                <div className="mt-5 w-100">
                  {[...Array(6)].map((ele) => (
                    <Skeleton active />
                  ))}
                </div>
              ) : (
                <div ref={rootRef}>
                  {getValidTags().map((ele, index) => {
                    return (
                      <div className={classes.TagSec}>
                        <div>
                          <p className={classes.trendLoc}>
                            Trending in {ele.country}
                          </p>
                          <p className={classes.trendTitle}>{ele.tag}</p>
                          <p className="mt-1">{ele.nugget_count} Nuggets</p>
                        </div>
                        <div className={classes.graphSec}>
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  label: <div>Not interested in this</div>,
                                  key: "0",
                                },
                                {
                                  label: (
                                    <div>This trend is harmful or spammy</div>
                                  ),
                                  key: "1",
                                },
                              ],
                            }}
                            trigger={["click"]}
                          >
                            <div className={classes.dropSec}>
                              <span class="material-symbols-outlined">
                                more_horiz
                              </span>
                            </div>
                          </Dropdown>
                          <TagsChart Data={ele.trends} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          {(loading || getHasNextPage()) && (
            <div className="text-center py-2" ref={sentryRef}>
              <Skeleton active />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TagsList;
