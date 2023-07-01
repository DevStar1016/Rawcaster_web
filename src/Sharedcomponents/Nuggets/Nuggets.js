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

const Nuggets = ({
  isLocked = false,
  isUserPostAvailable = true,
  isLoading = false,
  className = null,
}) => {
  const containerRef = useRef(null);
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

  useEffect(() => {
    if (loginuserData) {
      setNuggetCount({
        my_nuggets: loginuserData?.nugget_count ?? 0,
        favorites: loginuserData?.saved_nugget_count ?? 0,
      });
    }
  }, [loginuserData]);

  useEffect(() => {
    // return () => {
    //   if (ReadSource.current) {
    //     ReadSource.current.cancel("Request Cancelled");
    //   }
    // };
  }, [audio]);

  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;
    setProgress({
      percent: Math.round(val),
      show: true,
    });
  };

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

  const GetNuggetList = (page = 1, formData = null) => {
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

  const getHasNextPage = () => {
    return totalpages && pageRef.current !== totalpages;
  };

  const handleBottomLoader = () => {
    if (getHasNextPage()) {
      setisReachedEnd(true);
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomLoader);

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
  };

  const isValidPage = () => {
    if (getAuthenticated() && isUserPostAvailable && loginuserData) {
      if (parseInt(display_user_id) === parseInt(userData?.user_id)) {
        return true;
      } else if (!display_user_id) {
        return true;
      }
      return false;
    }
    return false;
  };

  const isuserConnection =
    display_user_id &&
    parseInt(display_user_id) !== parseInt(userData?.user_id);

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

  const loadMore = () => {
    if (isReachedEnd && getHasNextPage() && !loading) {
      setloading(true);
      pageRef.current = pageRef.current + 1;
      GetNuggetList(pageRef.current);
    }
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

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
          className={` ${
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
          // style={{ height: maxHeight ? maxHeight : "" }}
          className={` ${
            params?.key ? classes.resultnuggetSec : classes.nuggetSec
          } ${isuserConnection ? classes.othersnuggetSec : ""} ${
            className ? className : ""
          }`}
        >
          <>
            {isValidPage() && (
              <>{Progress.show ? <PostProgress /> : <PostNuggets />}</>
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
                  <span class="material-icons">home</span> For You
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
                  <span class="material-icons">people</span> Following
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
                          search_key: SearchKey,
                        };
                        dispatch(handleNuggetFormData(FormData));
                        GetNuggetList(1, FormData);
                      }
                    }}
                  >
                    <span class="material-icons">search</span>
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
                  <div ref={rootRef}>
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
                            }}
                            onEdit={(id) => {
                              setisEdit(id);
                            }}
                            onDelete={() => {
                              dispatch(handleDeleteNuggetList(ele.nugget_id));

                              if (GetNuggetList) {
                                GetNuggetList();
                              }
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
                    {(loading || getHasNextPage()) && (
                      <div ref={sentryRef}>
                        <NuggetLoaders loading={true} />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
          <FloatButton.BackTop />
        </div>
      )}
    </ListNuggetContext.Provider>
  );
};

export default Nuggets;
