import React, { useEffect, useRef, useState } from "react";
import classes from "./Nuggets.module.css";
import { useDispatch } from "react-redux";
import { listNuggetsService } from "../../Services/ApiService";
import { getAuthenticated, JSONtoformdata } from "../../Shared/Utility";
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

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

let isRequestCancel = false;

const Nuggets = () => {
  const source = useRef(null);

  const dispatch = useDispatch();
  const [Progress, setProgress] = useState({
    percent: 0,
    show: false,
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
    listNuggetsService(JSONtoformdata(nuggetData), source.current.token)
      .then((res) => {
        if (res.data.status === 1) {
          console.log(res.data);
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
          setPages({
            page: res.data.current_page_no,
            totalpage: res.data.total_pages,
          });
        } else {
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
  };

  useEffect(() => {
    if (NuggetList.length === 0) {
      dispatch(handleLoading(true));
      getNuggetList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEndReached = () => {
    console.log("test");
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);

      getNuggetList(Pages.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  const ListNuggetData = {
    NuggetList: NuggetList,
    getProgress() {
      return Progress;
    },
    getNuggetList() {
      return getNuggetList();
    },
    handleProgress(val) {
      return handleProgress(val);
    },
    setProgress: setProgress,
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

  const setScroll = () => {
    console.log("test");
  };

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom) {
      console.log("at the bottom");
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
      <div className={classes.nuggetSec} ref={scrollRef}>
        {getAuthenticated() && (
          <>
            {Progress.show ? (
              <PostProgress />
            ) : (
              <PostNuggets getNuggetList={getNuggetList} />
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
