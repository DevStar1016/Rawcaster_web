import React, { useState } from "react";
import classes from "./Nuggets.module.css";
import {
  DecryptionString,
  getAuthenticated,
  getRawcaserToken,
} from "../../Shared/Utility";
import dayjs from "dayjs";
import PostNuggets from "./PostNuggets";
import { ListNuggetContext } from "../../Shared/Context";
import PostProgress from "./PostProgress";
import Post from "./Post";
import { useParams } from "react-router";
import { useNuggets } from "../../Shared/Reduxfetcher";
import { Skeleton } from "antd";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { handleNuggetList } from "../../Store/Redux/Reducer/NuggetsReducer";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const Nuggets = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    Nuggets,
    isNuggetsLoading,
    totalpages,
    currentpage,
    nuggetFormData,
    isNextPageLoading,
  } = useNuggets();
  const isLoading = currentpage === 1 ? isNuggetsLoading : isNextPageLoading;
  const userData = getRawcaserToken();
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

  const GetNuggetList = (page = 1) => {
    let finalData = { ...nuggetFormData };
    finalData.formData = {
      ...finalData.formData,
      page_number: page,
    };

    dispatch(fetchNuggetsbyId(finalData));
  };

  const onEndReached = () => {
    if (totalpages !== currentpage && !isLoading) {
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
    getProgress() {
      return Progress;
    },

    handleProgress(val) {
      return handleProgress(val);
    },
  };

  const getValidNuggets = () => {
    const filteredArr = Nuggets.reduce((acc, current) => {
      const x = acc.find((item) => item.nugget_id === current.nugget_id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return filteredArr;
  };

  const isValidPage = () => {
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

  const isDisplayPost = () => {
    if (isValidPage()) {
      return "Share Your First Nugget";
    } else if (parseInt(display_user_id) !== parseInt(userData?.user_id)) {
      return "No Posts Available";
    }
    return "No Posts Available";
  };

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      <InfiniteScroll
        dataLength={getValidNuggets().length} //This is important field to render the next data
        next={onEndReached}
        loader={
          <div className="mt-3">
            <Skeleton loading={true} active avatar />
          </div>
        }
        hasMore={totalpages !== currentpage && !isLoading}
        className={params?.key ? classes.resultnuggetSec : classes.nuggetSec}
      >
        <>
          {isValidPage() && (
            <>{Progress.show ? <PostProgress /> : <PostNuggets />}</>
          )}
        </>

        {isNuggetsLoading ? (
          <div className="mt-3">
            {[...Array(6)].map(() => (
              <Skeleton loading={true} active avatar />
            ))}
          </div>
        ) : (
          <>
            {getValidNuggets()?.length === 0 ? (
              <div className="mt-3">
                <span
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  className="mt-3"
                >
                  {params.key ? "We didn't find any results" : isDisplayPost()}
                </span>
              </div>
            ) : (
              <>
                {getValidNuggets()?.map((ele, index) => {
                  return (
                    <Post
                      ele={ele}
                      index={index}
                      muted={muted}
                      setmuted={setmuted}
                      handleView={() => {
                        let findIndex = Nuggets.findIndex(
                          (elem) => elem.nugget_id === ele.nugget_id
                        );
                        let tempData = [...Nuggets];
                        if (tempData[findIndex].viewed !== 1) {
                          tempData[findIndex] = {
                            ...tempData[findIndex],
                            total_views: tempData[findIndex].total_views + 1,
                          };
                        }
                        tempData[findIndex] = {
                          ...tempData[findIndex],
                          viewed: 1,
                        };
                        dispatch(handleNuggetList(tempData));
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
                      HandleShare={() => {
                        GetNuggetList();
                      }}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </InfiniteScroll>
      {/* </InfiniteScroll> */}
    </ListNuggetContext.Provider>
  );
};

export default Nuggets;
