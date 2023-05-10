import React, { useEffect, useState } from "react";
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
import { Skeleton, Spin } from "antd";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  handleDeleteNuggetList,
  handleNuggetFormData,
  handleNuggetList,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import NuggetLoaders from "../../Components/Loaders/NuggetLoaders";
import NuggetLock from "../../Assets/Images/svg/nugget_lock.svg";

const Nuggets = ({ isLocked = false, isUserPostAvailable = true }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const [ViewedList, setViewedList] = useState([]);
  const [NuggetsData, setNuggetsData] = useState([]);
  const [isNuggetModify, setisNuggetModify] = useState(null);
  const {
    Nuggets,
    isNuggetsLoading,
    currentpage,
    nuggetFormData,
    totalNuggets,
  } = useNuggets();

  const userData = getRawcaserToken();
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
    page: 1,
    totalpage: 1,
  });

  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;
    setProgress({
      percent: Math.round(val),
      show: true,
    });
  };

  const GetNuggetList = (page = 1, formData = null) => {
    if (formData) {
      dispatch(fetchNuggetsbyId(formData));
      return;
    }
    let finalData = { ...nuggetFormData };
    finalData.formData = {
      ...finalData.formData,
      page_number: page,
    };

    dispatch(fetchNuggetsbyId(finalData)).then((res) => {
      setisNuggetModify(null);
    });
  };

  useEffect(() => {
    console.log(token);
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
      console.log("test");
      GetNuggetList(1, finalData);
    }
  }, [token]);

  const onEndReached = () => {
    if (parseInt(totalNuggets) !== Nuggets?.length) {
      GetNuggetList(currentpage + 1);
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

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      {isLocked ? (
        <div
          className={` ${
            params?.key ? classes.resultnuggetSec : classes.nuggetSec
          } ${isuserConnection ? classes.othersnuggetSec : ""} overflow-hidden`}
        >
          <div className={`mt-3 ${classes.NuggetLockSec}`}>
            <div className={classes.overlaySec}>
              <img src={NuggetLock} />
            </div>
            {[...Array(7)].map(() => (
              <NuggetLoaders loading={false} />
            ))}
          </div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={Nuggets?.length || 0} //This is important field to render the next data
          next={onEndReached}
          loader={
            <div className="mt-3 pt-3">
              <Skeleton loading={true} active avatar />
            </div>
          }
          hasMore={Nuggets && parseInt(totalNuggets) !== Nuggets?.length}
          className={` ${
            params?.key ? classes.resultnuggetSec : classes.nuggetSec
          } ${isuserConnection ? classes.othersnuggetSec : ""} ${
            display_user_id ? "h-auto" : ""
          }`}
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
            {isNuggetsLoading ? (
              <div className="mt-3">
                {[...Array(6)].map(() => (
                  <NuggetLoaders loading={true} />
                ))}
              </div>
            ) : (
              <>
                {Nuggets?.length === 0 ? (
                  <div className={classes.DisplayMsg}>
                    {params.key
                      ? "We didn't find any results"
                      : isDisplayPost()}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </>
            )}
          </>
        </InfiniteScroll>
      )}
    </ListNuggetContext.Provider>
  );
};

export default Nuggets;
