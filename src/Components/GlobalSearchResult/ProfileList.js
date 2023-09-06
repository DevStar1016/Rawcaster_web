/**
 * A React component that displays a list of profiles based on a search key.
 * @returns JSX element
 */
import SearchProfile from "../../Sharedcomponents/Profile/SearchProfile";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import { useDashboard } from "../../Shared/Reduxfetcher";
import classes from "./GlobalSearch.module.css";
import { searchRawcasterUsersService } from "../../Services/ApiService";
import axios from "axios";
import {
  DecryptionString,
  getAuthenticated,
  getAuthToken,
  getRawcaserToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Empty, Skeleton } from "antd";
import useInfiniteScroll from "react-infinite-scroll-hook";

let isRequestCancel = false;

const ProfileList = () => {
  const containerRef = useRef();
  const pageRef = useRef(1);
  const dispatch = useDispatch();
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [PeopleList, setPeopleList] = useState([]);
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
   * Retrieves a list of people from the server.
   * @param {number} [page=1] - The page number to retrieve.
   * @returns {Promise} - A promise that resolves with the list of people.
   */
  const getPeopleList = (page = 1) => {
    return new Promise((resolve, reject) => {
      if (source.current) {
        isRequestCancel = true;
        source.current.cancel("Request Cancelled");
      }
      source.current = axios.CancelToken.source();
      let nuggetData = {
        nugget_type: 0,
        token: getToken(),
        auth_code: getAuthToken(getToken()),
        search_key: searchKey,
        page_number: page,
      };
      searchRawcasterUsersService(
        JSONtoformdata(nuggetData),
        source.current.token
      )
        .then((res) => {
          if (res.data.status === 1) {
            if (res.data.current_page_no === 1) {
              setPeopleList(res.data.users_list);
            } else {
              setPeopleList((pre) =>
                [...pre, ...res.data.users_list].reduce((acc, current) => {
                  const x = acc.find(
                    (item) => item.user_id === current.user_id
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
            setPeopleList([]);
          }
        })
        .catch((err) => {})
        .finally(() => {
          dispatch(handleLoading(false));
          dispatch(handleisGlobalSearch(false));
          setloading(false);
          setTimeout(() => {
            setisFetching(false);
          }, 1000);
        });
    });
  };

  /**
   * Executes a side effect when the value of `pathname` changes.
   * If `isGlobalSearch` is true or `PeopleList` is empty, it dispatches a loading action,
   * sets `isFetching` to true, and calls the `getPeopleList` function.
   * @returns None
   */
  useEffect(() => {
    if (isGlobalSearch || PeopleList?.length === 0) {
      dispatch(handleLoading(true));

      setisFetching(true);
      getPeopleList();
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
   * If the user has reached the end, it sets the 'isReachedEnd' state to true.
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
   * it sets the loading state to true, increments the pageRef.current value by 1, and calls the getPeopleList function.
   * @returns None
   */
  const loadMore = () => {
    if (!getHasNextPage()) {
      setloading(false);
      setisReachedEnd(false);
    } else if (isReachedEnd && getHasNextPage() && !loading) {
      setloading(true);
      pageRef.current = pageRef.current + 1;
      getPeopleList(pageRef.current);
    }
  };

  /**
   * Initializes the useInfiniteScroll hook with the provided parameters.
   * @param {boolean} loading - Indicates whether the data is currently being loaded.
   * @param {function} getHasNextPage - A function that returns a boolean indicating whether there is more data to load.
   * @param {function} loadMore - A function that is called when more data needs to be loaded.
   * @returns An array containing the sentryRef and rootRef references.
   */
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

  /**
   * Adds a scroll event listener to the container element and removes it when the component is unmounted.
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

  /**
   * Returns a filtered array of valid people from the PeopleList array.
   * A person is considered valid if their user_id is unique within the array.
   * @returns {Array} - An array of valid people.
   */
  const getValidPeople = () => {
    if (PeopleList && PeopleList.length !== 0) {
      const filteredArr = PeopleList.reduce((acc, current) => {
        const x = acc.find((item) => item.user_id === current.user_id);
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
    <div className={` ${classes.profileSec}`} ref={containerRef}>
      {getValidPeople()?.length === 0 ? (
        <>
          {isFetching ? (
            <div className="mt-5 w-100">
              {[...Array(6)].map((ele) => (
                <Skeleton active />
              ))}
            </div>
          ) : (
            <>
              <div className={classes.DisplayMsg}>
                <Empty description=" We didn't find any results" />
              </div>
            </>
          )}
        </>
      ) : null}

      {getValidPeople()?.length !== 0 && (
        <>
          {isFetching && Pages.totalpage ? (
            <div className="mt-5 w-100">
              {[...Array(6)].map((ele) => (
                <Skeleton active />
              ))}
            </div>
          ) : (
            <div ref={rootRef}>
              {getValidPeople().map((ele) => {
                return (
                  <SearchProfile
                    ele={ele}
                    setPeopleList={setPeopleList}
                    PeopleList={PeopleList}
                  />
                );
              })}
              {(loading || getHasNextPage()) && (
                <div className="text-center py-2" ref={sentryRef}>
                  <Skeleton active />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
    // </BottomScrollListener>
  );
};

export default ProfileList;
