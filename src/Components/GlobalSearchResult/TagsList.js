/**
 * A React component that displays a list of tags and their corresponding trends.
 * @returns JSX element
 */
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

  /**
   * Retrieves the authentication token.
   * If the user is authenticated, it retrieves the token from the user data.
   * If the user is not authenticated, it returns a default token "RAWCAST".
   * @returns {string} - The authentication token.
   */
  const getToken = () => {
    if (getAuthenticated()) {
      const userData = getRawcaserToken();
      return userData?.token;
    } else {
      return "RAWCAST";
    }
  };

  /**
   * Retrieves a list of tags from the server, based on the specified page number.
   * @param {number} [page=1] - The page number to retrieve tags from. Default is 1.
   * @returns None
   */
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
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
        dispatch(handleisGlobalSearch(false));
        setisFetching(false);
      });
  };

  /**
   * Executes a side effect when the value of `pathname` changes.
   * If `isGlobalSearch` is true or `TagsList` is empty, it dispatches a loading action,
   * retrieves the list of tags, and sets `isFetching` to true.
   * @returns None
   */
  useEffect(() => {
    if (isGlobalSearch || TagsList?.length === 0) {
      dispatch(handleLoading(true));
      getTagsList();
      setisFetching(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /**
   * Checks if there is a next page available based on the current page reference and the total number of pages.
   * @returns {boolean} - True if there is a next page available, false otherwise.
   */
  const getHasNextPage = () => {
    return Pages.totalpage && pageRef.current !== Pages.totalpage;
  };

  /**
   * Handles the scroll event and checks if the user has reached the end of the container.
   * If the user has reached the end, it sets the `isReachedEnd` state to true.
   * @returns None
   */
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setisReachedEnd(true);
      }
    }
  };

  /**
   * Loads more data if there is a next page available.
   * If there is no next page, it sets the loading state to false and the isReachedEnd state to false.
   * If isReachedEnd is true and there is a next page available and the loading state is false,
   * it sets the loading state to true, increments the pageRef.current value by 1, and calls the getTagsList function.
   * @returns None
   */
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

  /**
   * Retrieves a list of unique tags from the TagsList array.
   * @returns {Array} An array of unique tags.
   */
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

  /**
   * Adds a scroll event listener to the container element and removes it when the component unmounts.
   * @returns None
   */
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
                          {/* <Dropdown
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
                              <span className="material-symbols-outlined">
                                more_horiz
                              </span>
                            </div>
                          </Dropdown> */}
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
