import React, { useEffect, useState } from "react";
import classes from "./Nuggets.module.css";
import { useDispatch } from "react-redux";
import {
  deleteNuggetService,
  likeAndUnlikeNuggetService,
  listNuggetsService,
} from "../../Services/ApiService";
import {
  getAuthenticated,
  getDataValueById,
  JSONtoformdata,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import dayjs from "dayjs";
import { SHARED_TYPE } from "../../Shared/Constant";
import { Dropdown, Tooltip } from "antd";
import ImageGrid from "../../UIComponents/ImageGrid";
import PostNuggets from "./PostNuggets";
import { getLocalStorageData } from "../../Store/Storage";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { Spinner } from "react-bootstrap";
import { useAuthData } from "../../Shared/Reduxfetcher";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const Nuggets = () => {
  const dispatch = useDispatch();
  const loginUserData = useAuthData();
  const [isUpdated, setisUpdated] = useState(true);
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

  const getNuggetList = (page = 1) => {
    let nuggetData = {
      nugget_type: 0,
      token: getToken(),
      page_number: page,
    };
    listNuggetsService(JSONtoformdata(nuggetData))
      .then((res) => {
        if (res.data.status === 1) {
          if (NuggetList.length === 0) {
            setNuggetList(res.data.nuggets_list);
          } else if (res.data.current_page_no === 1) {
            console.log("test");
            setNuggetList(res.data.nuggets_list);
          } else {
            setNuggetList((pre) => [...pre, ...res.data.nuggets_list]);
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
        toast.error(err.message);
      })
      .finally(() => {
        setisLoading(false);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    dispatch(handleLoading(true));
    getNuggetList();
  }, [isUpdated]);

  const onEndReached = () => {
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);
      getNuggetList(Pages.page + 1);
    }
  };

  const HandleLike = (id, like) => {
    let findIndex = NuggetList.findIndex((elem) => elem.nugget_id === id);
    let tempData = [...NuggetList];
    tempData[findIndex].liked = like === 1 ? true : false;
    tempData[findIndex].total_likes =
      like === 1
        ? tempData[findIndex].total_likes + 1
        : tempData[findIndex].total_likes - 1;
    setNuggetList(tempData);

    let nuggetData = {
      token: loginUserData?.token,
      nugget_id: id,
      like: like,
    };
    likeAndUnlikeNuggetService(JSONtoformdata(nuggetData))
      .then((res) => {
        if (res.data.status === 1) {
          getNuggetList();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const deletenugget = (id) => {
    dispatch(handleLoading(true));
    let formData = new FormData();
    formData.append("token", loginUserData?.token);
    formData.append("nugget_id", id);

    deleteNuggetService(formData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          getNuggetList(1);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  return (
    <div className={classes.nuggetSec} ref={scrollRef}>
      {getAuthenticated() && (
        <PostNuggets getNuggetList={getNuggetList} isUpdated={isUpdated} />
      )}
      {NuggetList?.map((ele) => {
        return (
          <div className={classes.nuggetItem}>
            <div className={classes.profilePart}>
              <div className={classes.proImg}>
                <img src={ele?.original_user_image} />
                <Tooltip title="Became A Fan" color="#e26386">
                  <i className={classes.viewCount}>{ele?.follow_count}</i>
                </Tooltip>
              </div>
              <p className={classes.proName}>{ele?.original_user_name}</p>
              <p className={classes.detailsRange}>
                <Tooltip
                  title={dayjs(ele?.created_date).format(
                    "DD MMM YYYY - hh:mm  A"
                  )}
                  color="rgb(250, 162, 27)"
                >
                  {dayjs(ele?.created_date).fromNow(true)} ago{" "}
                </Tooltip>
                <span class="material-icons">fiber_manual_record</span>
                {ele?.total_views} Views{" "}
                <span class="material-icons">fiber_manual_record</span>
                {getDataValueById(SHARED_TYPE, ele?.share_type)}
              </p>
            </div>
            {getAuthenticated() && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 1,
                      label: "Block user",
                    },
                    {
                      key: 2,
                      label: "Report Abuse",
                    },
                    {
                      key: 3,
                      label: "Share Link",
                    },
                    {
                      key: 4,
                      label: "Delete Nugget",
                    },
                  ],
                  onClick: (val) => {
                    if (parseInt(val.key)) {
                      deletenugget(ele.nugget_id);
                    }
                  },
                  selectable: true,
                }}
              >
                <div className={classes.dropMenu}>
                  <span class="material-icons">more_horiz</span>
                </div>
              </Dropdown>
            )}
            <div className={classes.contentSec}>
              <div className={classes.feedsSec}>
                <p>{ele?.content}</p>
                <ImageGrid imgArray={ele.media_list} />
              </div>
              <div className={classes.floattingSec}>
                <div
                  className={
                    ele?.liked ? classes.activeiconsec : classes.iconsec
                  }
                  onClick={() => {
                    if (getAuthenticated()) {
                      let like = ele.liked ? 2 : 1;
                      HandleLike(ele.nugget_id, like);
                    }
                  }}
                >
                  <p
                    style={{ cursor: getAuthenticated() ? "pointer" : "auto" }}
                  >
                    <i
                      className={`${classes.inactive_like_icon} ${
                        !getAuthenticated() && classes.disabled
                      }`}
                    />
                  </p>
                  <span>{ele.total_likes}</span>
                </div>
                <div className={classes.iconsec}>
                  <p
                    style={{ cursor: getAuthenticated() ? "pointer" : "auto" }}
                  >
                    <i
                      className={`${classes.commentIcon} ${
                        !getAuthenticated() && classes.disabled
                      }`}
                    />
                  </p>
                  <span>{ele.total_comments}</span>
                </div>
                <div className={classes.iconsec}>
                  <p style={{ cursor: loginUserData ? "pointer" : "auto" }}>
                    <i
                      className={`${classes.share_icon} ${
                        !getAuthenticated() && classes.disabled
                      }`}
                    />
                  </p>
                  <span>500</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {isLoading && (
        <div className="text-center py-2">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </div>
  );
};

export default Nuggets;
