import React, { useEffect, useRef, useState } from "react";
import classes from "./Nuggets.module.css";
import {
  DecryptionString,
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
import { Spin } from "antd";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import {
  handleDeleteNuggetList,
  handleNuggetFormData,
  handleNuggetList,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import NuggetLoaders from "../../Components/Loaders/NuggetLoaders";
import NuggetLock from "../../Assets/Images/svg/nugget_lock.svg";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

const Nuggets = ({
  isLocked = false,
  isUserPostAvailable = true,
  isLoading = false,
  maxHeight = null,
  className = null,
}) => {
  const pageRef = useRef(1);
  const dispatch = useDispatch();
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  const [ViewedList, setViewedList] = useState([]);
  const [NuggetsData, setNuggetsData] = useState([]);
  const [isNuggetModify, setisNuggetModify] = useState(null);
  const { Nuggets, isNuggetsLoading, nuggetFormData, totalpages } =
    useNuggets();
  const userData = getRawcaserToken();
  const [isReachedEnd, setisReachedEnd] = useState(false);
  const token = useAuthToken();
  const loginuserData = useAuthData();
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

  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;
    setProgress({
      percent: Math.round(val),
      show: true,
    });
  };

  const GetNuggetList = (page = 1, formData = null) => {
    return new Promise((resolve, reject) => {
      if (formData) {
        console.log("test");
        dispatch(fetchNuggetsbyId(formData)).then((res) => {
          pageRef.current = res.payload.current_page_no;
          setPages({
            page: res.payload.current_page_no,
            totalpage: res.payload.total_pages,
          });
          setloading(false);
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
            search_key: splitData[2],
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
    if (isValidPage()) {
      return "Share Your First Nugget";
    } else if (parseInt(display_user_id) !== parseInt(userData?.user_id)) {
      return "No Posts Available";
    }
    return "No Posts Available";
  };

  useEffect(() => {
    setNuggetsData(Nuggets);
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
          ref={scrollRef}
          // style={{ height: maxHeight ? maxHeight : "" }}
          className={` ${
            params?.key ? classes.resultnuggetSec : classes.nuggetSec
          } ${isuserConnection ? classes.othersnuggetSec : ""} ${
            maxHeight ? "h-auto" : ""
          } ${className ? className : ""}`}
        >
          <>
            {isValidPage() && (
              <>{Progress.show ? <PostProgress /> : <PostNuggets />}</>
            )}
          </>

          {isNuggetModify?.type === "add" && (
            <div className="mt-3">
              <NuggetLoaders loading={true} />
            </div>
          )}

          <>
            {isNuggetsLoading || totalpages === null ? (
              <div className="mt-3">
                {[...Array(6)].map(() => (
                  <NuggetLoaders loading={true} />
                ))}
              </div>
            ) : (
              <>
                {Nuggets?.length === 0 ? (
                  <div className={classes.DisplayMsg}>
                    {searchKey ? "We didn't find any results" : isDisplayPost()}
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
                              dispatch(handleNuggetList(tempData));
                            }}
                            handleSave={(save) => {
                              let findIndex = Nuggets.findIndex(
                                (elem) => elem.nugget_id === ele.nugget_id
                              );
                              let tempData = [...Nuggets];
                              tempData[findIndex] = {
                                ...tempData[findIndex],
                                saved: save === 1 ? true : false,
                              };
                              dispatch(handleNuggetList(tempData));
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
        </div>
      )}
    </ListNuggetContext.Provider>
  );
};

export default Nuggets;
