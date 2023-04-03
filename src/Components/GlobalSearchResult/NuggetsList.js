import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import {
  globalSearchNuggetsService,
  listNuggetsService,
} from "../../Services/ApiService";
import { ListNuggetContext } from "../../Shared/Context";
import { useDashboard } from "../../Shared/Reduxfetcher";
import {
  getAuthenticated,
  getRawcaserToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import Post from "../../Sharedcomponents/Nuggets/Post";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { getCookieData } from "../../Store/Storage";
import classes from "./GlobalSearch.module.css";

let isRequestCancel = false;

const NuggetsList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [NuggetList, setNuggetList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [Pages, setPages] = useState({
    page: 1,
    totalpage: 1,
  });

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = getRawcaserToken();
      return userData?.token;
    } else {
      return "RAWCAST";
    }
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
      search_key: params.key,
      page_number: page,
    };
    listNuggetsService(JSONtoformdata(nuggetData), source.current.token)
      .then((res) => {
        if (res.data.status === 1) {
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
          setNuggetList([]);
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
        dispatch(handleisGlobalSearch(false));
      });
  };

  useEffect(() => {
    if (isGlobalSearch || (NuggetList && NuggetList?.length === 0)) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      dispatch(handleLoading(true));
      getNuggetList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isGlobalSearch]);

  const onEndReached = () => {
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);

      getNuggetList(Pages.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  const getValidNuggets = () => {
    if (NuggetList && NuggetList.length !== 0) {
      const filteredArr = NuggetList.reduce((acc, current) => {
        const x = acc.find((item) => item.nugget_id === current.nugget_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      if (filteredArr) {
        return filteredArr;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  return (
    <>
      {getValidNuggets()?.length === 0 ? (
        <span style={{ fontSize: 20, fontWeight: "bold" }} className="mt-3">
          We didn't find any results
        </span>
      ) : null}
      <div className={classes.nuggetSec} ref={scrollRef}>
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
              handleSave={(save) => {
                let findIndex = NuggetList.findIndex(
                  (elem) => elem.nugget_id === ele.nugget_id
                );
                let tempData = [...NuggetList];
                tempData[findIndex].saved = save.toString();

                setNuggetList(tempData);
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
    </>
  );
};

export default NuggetsList;
