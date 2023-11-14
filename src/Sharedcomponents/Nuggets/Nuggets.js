/**
 * A React component that displays a list of nuggets.
 * @param {boolean} [isLocked=false] - Indicates whether the nuggets are locked.
 * @param {boolean} [isUserPostAvailable=true] - Indicates whether the user's posts are available.
 * @param {boolean} [isLoading=false] - Indicates whether the nuggets are currently loading.
 * @param {string} [className=null] - The CSS class name for the component.
 * @returns The Nuggets component.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import classes from "./Nuggets.module.css";
import {
  DecryptionString,
  detectMob,
  getAuthenticated,
  getRawcaserToken,
} from "../../Shared/Utility";
import PostNuggets from "./PostNuggets";
import { ListNuggetContext } from "../../Shared/Context";
import PostProgress from "./PostProgress";
import Post from "./Post";
import { useParams } from "react-router";
import {
  useAuthData,
  useAuthToken,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import { Empty, FloatButton, Spin } from "antd";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import {
  handleDashboardFilterType,
  handleDeleteNuggetList,
  handleNuggetFormData,
  handleNuggetList,
  handleNuggetViewAPIUpdate,
  handleNuggetViewUpdate,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import NuggetLoaders from "../../Components/Loaders/NuggetLoaders";
import NuggetLock from "../../Assets/Images/svg/nugget_lock.svg";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import _debounce from "lodash/debounce";
import { Form, InputGroup } from "react-bootstrap";
import FavImg from "../../Assets/Icons/svg/Favorite.svg";
import { handleloginModalShow } from "../../Store/Redux/Reducer/DashboardReducer";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";

const Nuggets = ({
  isLocked = false,
  isUserPostAvailable = true,
  isLoading = false,
  className = null,
}) => {
  const containerRef = useRef(null);
  const ReadoutRef = useRef(null);
  const pageRef = useRef(1);
  const viewRef = useRef([]);
  const dispatch = useDispatch();
  const params = useParams();
  const [SearchKey, setSearchKey] = useState("");
  const [ActiveTab, setActiveTab] = useState(0);
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  const [ViewedList, setViewedList] = useState([]);
  const [NuggetsData, setNuggetsData] = useState([]);
  const [isNuggetModify, setisNuggetModify] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(null);
  const {
    Nuggets,
    isNuggetsLoading,
    nuggetFormData,
    totalpages,
    DashboardfilterType,
  } = useNuggets();

  const userData = getRawcaserToken();
  const [isloading, setisLoading] = useState(false);
  const [isReachedEnd, setisReachedEnd] = useState(false);
  const token = useAuthToken();
  const loginuserData = useAuthData();
  const [NuggetCount, setNuggetCount] = useState({
    my_nuggets: 0,
    favorites: 0,
  });
  const display_user_id = params?.user_id
    ? DecryptionString(params?.user_id)
    : null;
  const [muted, setmuted] = useState(false);
  const [Progress, setProgress] = useState({
    percent: 0,
    show: false,
  });
  const [isEdit, setisEdit] = useState(null);
  const [Pages, setPages] = useState({
    page: null,
    totalpage: null,
  });
  const [loading, setloading] = useState(false);

  /**
   * useEffect hook that updates the nugget count state when the login user data changes.
   * @param {Object} loginuserData - The login user data object.
   * @returns None
   */
  useEffect(() => {
    if (loginuserData) {
      setNuggetCount({
        my_nuggets: loginuserData?.nugget_count ?? 0,
        favorites: loginuserData?.saved_nugget_count ?? 0,
      });
    }
  }, [loginuserData]);

  /**
   * Handles the progress of a task and updates the progress state.
   * @param {object} progress - The progress object containing the loaded and total values.
   * @returns None
   */
  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;
    setProgress({
      percent: Math.round(val),
      show: true,
    });
  };

  /**
   * Handles the view handling logic for updating the Nugget view API and updating
   * each element in the viewRef.
   * @param {number} index - The index of the view handling operation.
   * @returns None
   */
  const ViewHandling = (index) => {
    dispatch(handleNuggetViewAPIUpdate(viewRef.current));
    for (let i = 0; i < viewRef.current.length; i++) {
      const element = viewRef.current[i];
      dispatch(handleNuggetViewUpdate(element));
    }
    viewRef.current = [];
  };

  const ViewProgress = useCallback(
    _debounce(ViewHandling, 2000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Retrieves a list of nuggets based on the specified page number and form data.
   * @param {number} [page=1] - The page number to retrieve the nuggets from.
   * @param {object} [formData=null] - The form data to filter the nuggets.
   * @returns {Promise} - A promise that resolves with the retrieved nuggets data.
   */
  const GetNuggetList = (page = 1, formData = null) => {
    if (page === 1) {
      setisLoading(true);
    }
    return new Promise((resolve, reject) => {
      if (formData) {
        dispatch(fetchNuggetsbyId(formData)).then((res) => {
          if (formData.formData.saved === 1) {
            setNuggetCount((pre) => ({
              ...pre,
              favorites: res.payload.total_count,
            }));
          } else {
            setNuggetCount((pre) => ({
              ...pre,
              my_nuggets: res.payload.total_count,
            }));
          }
          pageRef.current = res.payload.current_page_no;
          setPages({
            page: res.payload.current_page_no,
            totalpage: res.payload.total_pages,
          });
          setNuggetsData(res.payload.data);
          setloading(false);
          setisLoading(false);
          setisReachedEnd(false);
        });
        return;
      }
      let finalData = { ...nuggetFormData };
      finalData.formData = {
        ...finalData.formData,
        page_number: page,
      };
      dispatch(fetchNuggetsbyId(finalData)).then((res) => {
        setisNuggetModify(null);
        setloading(false);
        setisReachedEnd(false);
        setisLoading(false);
      });
    });
  };

  /**
   * Checks if there is a next page available based on the current page reference and the total number of pages.
   * @returns {boolean} - true if there is a next page available, false otherwise.
   */
  const getHasNextPage = () => {
    return totalpages && pageRef.current !== totalpages;
  };

  /**
   * Handles the bottom loader functionality.
   * If there is a next page available, it sets the 'isReachedEnd' state to true.
   * @returns None
   */
  const handleBottomLoader = () => {
    if (getHasNextPage()) {
      setisReachedEnd(true);
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomLoader);

  /**
   * Executes a side effect when the component mounts or when the `token` or `isLoading` dependencies change.
   * If `isLocked` or `isLoading` is true, the effect returns early and does not execute the rest of the code.
   * If `Nuggets` is an empty array, it prepares the `finalData` object with a default token and form data.
   * If the current URL path includes "globalsearch", it adds the decrypted search key to the `finalData` object.
   * If the current URL path includes "viewprofile", it adds the decrypted user ID to the `finalData` object.
   * Finally, it dispatches the `handleNuggetFormData` action with the `finalData`
   */
  useEffect(() => {
    if (isLocked || isLoading) {
      return;
    }
    if (Nuggets?.length === 0) {
      let finalData = {
        token: token ? token : "RAWCAST",
        formData: { page_number: 1, nugget_type: 0 },
      };
      if (window.location.pathname.includes("globalsearch")) {
        let splitData = window.location.pathname.split("/");
        finalData = {
          ...finalData,
          formData: {
            ...finalData.formData,
            global_search: 1,
            search_key: DecryptionString(splitData[2]),
          },
        };
      } else if (window.location.pathname.includes("viewprofile")) {
        let splitData = window.location.pathname.split("/");
        finalData = {
          ...finalData,
          formData: {
            ...finalData.formData,
            user_id:
              splitData[2] && splitData[2] !== ""
                ? DecryptionString(splitData[2])
                : null,
          },
        };
      }
      dispatch(handleNuggetFormData(finalData));
      GetNuggetList(1, finalData);
    }
  }, [token, isLoading]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setisReachedEnd(true);
        // User has reached the bottom (with a 10px threshold)
        // Perform your desired action here, e.g., fetch more data
      }
    }
  };

  const ListNuggetData = {
    setProgress,
    Pages,
    setPages,
    setisEdit,
    isEdit,
    GetNuggetList,
    ViewedList,
    setisNuggetModify,
    setViewedList,
    audio,
    setAudio,
    isPlaying,
    setisPlaying,
    getProgress() {
      return Progress;
    },
    handleProgress(val) {
      return handleProgress(val);
    },
    setNuggetCount,
    ReadoutRef,
  };

  /**
   * Checks if the current page is valid based on authentication and user data.
   * @returns {boolean} - true if the page is valid, false otherwise.
   */

  const isValidPage = () => {
    if (getAuthenticated() && loginuserData) {
      if (parseInt(display_user_id) === parseInt(userData?.user_id)) {
        return true;
      } else if (!display_user_id) {
        return true;
      }
      return false;
    }
    return false;
  };

  /**
   * Checks if the user connection is valid based on the provided display_user_id and userData.
   * @param {string} display_user_id - The display user ID.
   * @param {object} userData - The user data object.
   * @returns {boolean} True if the user connection is valid, false otherwise.
   */
  const isuserConnection =
    display_user_id &&
    parseInt(display_user_id) !== parseInt(userData?.user_id);

  /**
   * Checks if the current page is a display post page.
   * @returns {string | JSX.Element} - Returns a string or JSX element based on the conditions.
   * If the page is valid and the active tab is 0, it returns the string "Share Your First Nugget".
   * If the display_user_id is not equal to the user_id in the userData object, it returns an Empty component with the description "No Posts Available".
   * Otherwise, it returns an Empty component with the description "No Posts Available".
   */
  const isDisplayPost = () => {
    if (isValidPage() && ActiveTab === 0) {
      return "Share Your First Nugget";
    } else if (parseInt(display_user_id) !== parseInt(userData?.user_id)) {
      return <Empty description="No Posts Available" />;
    }
    return <Empty description="No Posts Available" />;
  };

  useEffect(() => {
    // if (NuggetsData.length === 0) {
    setNuggetsData(Nuggets);
    // }
  }, [Nuggets]);

  /**
   * Loads more data when the end is reached, there is a next page available, and
   * no loading is currently in progress.
   * @returns None
   */
  const loadMore = () => {
    if (isReachedEnd && getHasNextPage() && !loading) {
      setloading(true);
      pageRef.current = pageRef.current + 1;
      GetNuggetList(pageRef.current);
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
   * Handles the selection of a filter type and updates the filter data accordingly.
   * @param {string} type - The selected filter type.
   * @returns None
   */
  const handleFilterType = (type) => {
    let filterData = { ...nuggetFormData };

    filterData.formData = {
      page_number: 1,
      nugget_type: 0,
      filter_type: type,
    };
    dispatch(handleResetNuggets());
    dispatch(handleDashboardFilterType(type));
    dispatch(handleNuggetFormData(filterData));
    dispatch(fetchNuggetsbyId(filterData));
  };

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      {isLocked || isLoading ? (
        <div
          className={`${display_user_id ? classes.profileSec : ""} ${
            params?.key ? classes.resultnuggetSec : classes.nuggetSec
          } ${isuserConnection ? classes.othersnuggetSec : ""} overflow-hidden`}
        >
          <div className={`mt-3 ${classes.NuggetLockSec}`}>
            {!isLoading && (
              <div className={classes.overlaySec}>
                <img src={NuggetLock} alt="nugget_lock" />
              </div>
            )}
            {[...Array(7)].map(() => (
              <NuggetLoaders loading={false} />
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            height: display_user_id ? "100%" : "",
          }}
          // style={{ height: maxHeight ? maxHeight : "" }}
          className={`${display_user_id ? classes.profileSec : ""} ${
            params?.key ? classes.resultnuggetSec : classes.nuggetSec
          } ${isuserConnection ? classes.othersnuggetSec : ""} ${
            className ? className : ""
          }`}
        >
          <>
            {isValidPage() && (
              <>
                {Progress.show ? (
                  <PostProgress />
                ) : (
                  <PostNuggets isUserPostAvailable={isUserPostAvailable} />
                )}
              </>
            )}
          </>
          {detectMob() && !display_user_id && !params?.key && (
            <div className={classes.CategorySec}>
              <div className={classes.TabSec}>
                <p
                  className={DashboardfilterType === 0 ? classes.activeSec : ""}
                  onClick={() => {
                    handleFilterType(0);
                  }}
                >
                  <span className="material-icons">home</span> For You
                </p>
                <p
                  className={DashboardfilterType === 1 ? classes.activeSec : ""}
                  onClick={() => {
                    if (userData) {
                      handleFilterType(1);
                    } else {
                      dispatch(handleloginModalShow(true));
                    }
                  }}
                >
                  <span className="material-icons">people</span> Following
                </p>
              </div>
            </div>
          )}

          {display_user_id && !isuserConnection && (
            <div className={classes.loginuserContainer}>
              <div className={classes.filterSec}>
                <InputGroup>
                  <Form.Control
                    className={classes.inSearch}
                    placeholder="Search nuggets..."
                    aria-label="Search nuggets..."
                    value={SearchKey}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (SearchKey !== nuggetFormData.formData.search_key) {
                          setisLoading(true);
                          let FormData = { ...nuggetFormData };
                          FormData["formData"] = {
                            ...FormData["formData"],
                            global_search: 1,
                            search_key: SearchKey,
                          };
                          dispatch(handleNuggetFormData(FormData));
                          GetNuggetList(1, FormData);
                        }
                      }
                    }}
                    onChange={(e) => {
                      setSearchKey(e.target.value);
                    }}
                  />
                  <InputGroup.Text
                    className={classes.searchIcon}
                    onClick={() => {
                      if (SearchKey !== nuggetFormData.formData.search_key) {
                        setisLoading(true);
                        let FormData = { ...nuggetFormData };
                        FormData["formData"] = {
                          ...FormData["formData"],
                          global_search: 1,
                          search_key: SearchKey,
                        };
                        dispatch(handleNuggetFormData(FormData));
                        GetNuggetList(1, FormData);
                      }
                    }}
                  >
                    <span className="material-icons">search</span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
              <div className={classes.TabSec}>
                <p
                  className={ActiveTab === 0 ? classes.activeSec : ""}
                  onClick={() => {
                    if (ActiveTab !== 0) {
                      setisLoading(true);
                      setSearchKey("");
                      let splitData = window.location.pathname.split("/");
                      let finalData = {
                        token: token,
                        formData: {
                          page_number: 1,
                          nugget_type: 0,
                          user_id:
                            splitData[2] && splitData[2] !== ""
                              ? DecryptionString(splitData[2])
                              : null,
                        },
                      };
                      dispatch(handleNuggetFormData(finalData));
                      GetNuggetList(1, finalData);
                    }

                    setActiveTab(0);
                  }}
                >
                  My Nuggets{" "}
                  {NuggetCount?.my_nuggets !== 0
                    ? `(${NuggetCount?.my_nuggets})`
                    : ""}
                </p>
                <p
                  className={ActiveTab === 1 ? classes.activeSec : ""}
                  onClick={() => {
                    if (ActiveTab !== 1) {
                      setisLoading(true);
                      setSearchKey("");
                      let finalData = {
                        token: token,
                        formData: { page_number: 1, nugget_type: 0, saved: 1 },
                      };
                      dispatch(handleNuggetFormData(finalData));
                      GetNuggetList(1, finalData);
                    }
                    setActiveTab(1);
                  }}
                >
                  <img src={FavImg} />
                  Favorites{" "}
                  {NuggetCount?.favorites !== 0
                    ? `(${NuggetCount?.favorites})`
                    : ""}
                </p>
              </div>
            </div>
          )}
          {isNuggetModify?.type === "add" && (
            <div className="mt-3">
              <NuggetLoaders loading={true} />
            </div>
          )}

          <>
            {isNuggetsLoading || totalpages === null || isloading ? (
              <div className="mt-3">
                {[...Array(6)].map(() => (
                  <NuggetLoaders loading={true} />
                ))}
              </div>
            ) : (
              <>
                {Nuggets?.length === 0 ? (
                  <div className={classes.DisplayMsg}>
                    {searchKey ? (
                      <Empty description="We didn't find any results" />
                    ) : (
                      isDisplayPost()
                    )}
                  </div>
                ) : (
                  <div className={classes.nuggetScroll} ref={rootRef}>
                    {NuggetsData?.map((ele, index) => {
                      return (
                        <Spin
                          tip="Please Wait..."
                          size="small"
                          spinning={
                            isNuggetModify &&
                            parseInt(isNuggetModify?.id) ===
                              parseInt(ele.nugget_id)
                          }
                        >
                          <Post
                            ele={ele}
                            index={index}
                            muted={muted}
                            setmuted={setmuted}
                            handleView={(index) => {
                              viewRef.current = [...viewRef.current, index];
                              ViewProgress(index);
                            }}
                            handleLike={(like) => {
                              let findIndex = Nuggets.findIndex(
                                (elem) => elem.nugget_id === ele.nugget_id
                              );
                              let tempData = [...Nuggets];
                              tempData[findIndex] = {
                                ...tempData[findIndex],
                                liked: like === 1 ? true : false,
                                total_likes:
                                  like === 1
                                    ? tempData[findIndex].total_likes + 1
                                    : tempData[findIndex].total_likes - 1,
                              };
                              setNuggetsData(tempData);
                              dispatch(handleNuggetList(tempData));
                            }}
                            handleSave={(save) => {
                              if (ActiveTab === 1 && save !== 1) {
                                setNuggetsData((pre) => {
                                  const data = pre.filter(
                                    (elem) => elem.nugget_id !== ele.nugget_id
                                  );
                                  return data;
                                });
                                setNuggetCount((pre) => ({
                                  ...pre,
                                  favorites: pre.favorites - 1,
                                }));
                              } else {
                                let findIndex = Nuggets.findIndex(
                                  (elem) => elem.nugget_id === ele.nugget_id
                                );
                                let tempData = [...Nuggets];
                                tempData[findIndex] = {
                                  ...tempData[findIndex],
                                  saved: save === 1 ? true : false,
                                };
                                setNuggetsData(tempData);
                                dispatch(handleNuggetList(tempData));
                              }
                            }}
                            onSaveCountResult={(val) => {
                              setNuggetCount((pre) => ({
                                ...pre,
                                favorites: val,
                              }));
                              dispatch(
                                handleLoginData({
                                  ...loginuserData,
                                  saved_nugget_count: val,
                                })
                              );
                            }}
                            onEdit={(id) => {
                              setisEdit(id);
                            }}
                            onDelete={() => {
                              dispatch(handleDeleteNuggetList(ele.nugget_id));
                              if (display_user_id) {
                                if (nuggetFormData.formData.saved === 1) {
                                  setNuggetCount((pre) => ({
                                    ...pre,
                                    favorites: pre.favorites - 1,
                                  }));
                                } else {
                                  setNuggetCount((pre) => ({
                                    ...pre,
                                    my_nuggets: pre.my_nuggets - 1,
                                  }));
                                }
                              }
                              // if (GetNuggetList) {
                              //   GetNuggetList();
                              // }
                            }}
                            HandleShare={() => {
                              if (GetNuggetList) {
                                GetNuggetList();
                              }
                            }}
                          />
                        </Spin>
                      );
                    })}
                    {loading && <NuggetLoaders loading={true} />}
                    {(loading || getHasNextPage()) && (
                      <div ref={sentryRef}>
                        <div>{/* <NuggetLoaders loading={true} /> */}</div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
          <FloatButton.BackTop className={classes.backToTop} />
        </div>
      )}
    </ListNuggetContext.Provider>
  );
};

export default Nuggets;
