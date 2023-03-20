import React, { useEffect, useRef, useState } from "react";
import classes from "./Nuggets.module.css";
import { useDispatch } from "react-redux";
import { listNuggetsService } from "../../Services/ApiService";
import {
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

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

let isRequestCancel = false;

const Nuggets = () => {
  const source = useRef(null);
  const params = useParams();
  const dispatch = useDispatch();
  const [Progress, setProgress] = useState({
    percent: 0,
    show: false,
  });
  const pageRef = useRef({
    page: 1,
    totalpage: 1,
  });
  const [isLoading, setisLoading] = useState(false);
  const [NuggetList, setNuggetList] = useState([]);
  const [Pages, setPages] = useState({
    page: 1,
    totalpage: 1,
  });

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = JSON.parse(getLocalStorageData("rawcaster_user_token"));
      return userData?.token;
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

  const getNuggetList = (page = 1) => {
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
      };

      if (params.key) {
        nuggetData = {
          ...nuggetData,
          search_key: params.key,
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
            toast.error(res.data.msg);
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
        });
    });

    return promise;
  };

  useEffect(() => {
    if (NuggetList.length === 0) {
      dispatch(handleLoading(true));
      getNuggetList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.key) {
      getNuggetList();
    }
  }, [params]);

  const onEndReached = () => {
    if (pageRef.current.page !== pageRef.current.totalpage) {
      setisLoading(true);

      getNuggetList(pageRef.current.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  const ListNuggetData = {
    NuggetList: NuggetList,
    getProgress() {
      return Progress;
    },
    async getNuggetList() {
      return await getNuggetList();
    },
    handleProgress(val) {
      return handleProgress(val);
    },
    setProgress: setProgress,
    setNuggetList: setNuggetList,
    Pages: Pages,
    setPages: setPages,
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

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      <div
        className={params.key ? classes.resultnuggetSec : classes.nuggetSec}
        ref={scrollRef}
      >
        {!params.key && (
          <>
            {getAuthenticated() && (
              <>
                {Progress.show ? (
                  <PostProgress />
                ) : (
                  <PostNuggets getNuggetList={getNuggetList} />
                )}
              </>
            )}
          </>
        )}
        {getValidNuggets()?.map((ele, index) => {
          return (
            <Post
              ele={ele}
              index={index}
              getList={getNuggetList}
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
                tempData[findIndex].saved = save.toString();

                setNuggetList(tempData);
              }}
              HandleShare={() => {
                console.log("share");
              }}
            />
          );
        })}
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
