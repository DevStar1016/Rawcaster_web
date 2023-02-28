import React, { useEffect, useRef, useState } from "react";
import classes from "./Nuggets.module.css";
import { useDispatch } from "react-redux";
import {
  deleteNuggetService,
  likeAndUnlikeNuggetService,
  listNuggetsService,
  nuggetCommentListService,
} from "../../Services/ApiService";
import {
  decodeHtml,
  getAuthenticated,
  getDataValueById,
  isAccountValid,
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
import {
  handleLoading,
  handleloginModalShow,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Spinner } from "react-bootstrap";
import { useAuthData } from "../../Shared/Reduxfetcher";

import CommentsList from "./CommentsList";
import { ListNuggetContext } from "../../Shared/Context";
import axios from "axios";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

let isRequestCancel = false;

const Nuggets = () => {
  var _ = require("lodash");
  const source = useRef(null);
  const dispatch = useDispatch();
  const loginUserData = useAuthData();

  const [muted, setmuted] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [CommentList, setCommentList] = useState([]);
  const [isCommentLoading, setisCommentLoading] = useState(false);
  const [Comments, setComments] = useState("");
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
          if (res.data.current_page_no === 1) {
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
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);

      getNuggetList(Pages.page + 1);
    }
  };

  const HandleLike = (id, like) => {
    let nuggetData = {
      token: loginUserData?.token,
      nugget_id: id,
      like: like,
    };
    likeAndUnlikeNuggetService(JSONtoformdata(nuggetData), source.current.token)
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

  const getCommentList = (id) => {
    setisCommentLoading(true);
    let listComment = {
      token: loginUserData?.token,
      nugget_id: id,
    };
    nuggetCommentListService(JSONtoformdata(listComment))
      .then((res) => {
        if (res.data.status === 1) {
          setCommentList(res.data.comments);
        } else {
          setCommentList([]);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setisCommentLoading(false);
      });
  };

  const ListNuggetData = {
    nugget_id: Comments,
    CommentList: CommentList,
    isCommentLoading: isCommentLoading,
    getCommentList(id) {
      return getCommentList(id);
    },
    getNuggetList() {
      return getNuggetList();
    },
  };

  const getMoreValues = (ele) => {
    let resultData = [
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
    ];
    if (ele.user_id !== loginUserData?.user_id) {
      resultData = resultData.filter((ele) => ele.key !== 4);
    }
    return resultData;
  };

  var debounceProcess = _.debounce(
    function (nugget_id, like) {
      HandleLike(nugget_id, like);
    },
    1000,
    true
  );

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      <div className={classes.nuggetSec} ref={scrollRef}>
        {getAuthenticated() && <PostNuggets getNuggetList={getNuggetList} />}
        {NuggetList?.map((ele, index) => {
          return (
            <div className={classes.nuggetItem}>
              <div className={classes.profilePart}>
                <div className={classes.proImg}>
                  <img
                    src={ele?.original_user_image}
                    alt="original_user_image"
                  />
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
                  <i class="material-icons">fiber_manual_record</i>
                  {ele?.total_views} Views{" "}
                  <i class="material-icons">fiber_manual_record</i>
                  {getDataValueById(SHARED_TYPE, ele?.share_type)}
                </p>
              </div>
              {getAuthenticated() && (
                <Dropdown
                  menu={{
                    items: getMoreValues(ele),
                    onClick: (val) => {
                      if (parseInt(val.key) === 4) {
                        deletenugget(ele.nugget_id);
                      }
                    },
                    selectable: false,
                  }}
                >
                  <div className={classes.dropMenu}>
                    <span class="material-icons">more_horiz</span>
                  </div>
                </Dropdown>
              )}
              <div className={classes.contentSec}>
                <div className={classes.feedsSec}>
                  <p>{decodeHtml(ele?.content)}</p>
                  <div className={classes.imgContainer}>
                    <ImageGrid
                      imgArray={ele.media_list}
                      muted={muted}
                      mutenuggetaudio={setmuted}
                    />
                  </div>
                </div>
                <div className={classes.floattingSec}>
                  <div
                    className={
                      ele?.liked ? classes.activeiconsec : classes.iconsec
                    }
                    onClick={() => {
                      if (getAuthenticated()) {
                        if (isAccountValid()) {
                          let like = ele.liked ? 2 : 1;
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
                          debounceProcess(ele.nugget_id, like);
                        } else {
                          dispatch(
                            handleprofileVerifyModalShow({
                              show: true,
                              msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                            })
                          );
                        }
                      } else {
                        dispatch(handleloginModalShow(true));
                      }
                    }}
                  >
                    <p
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <i className={`${classes.inactive_like_icon}`} />
                    </p>
                    <span>{ele.total_likes}</span>
                  </div>
                  <div
                    className={
                      Comments === ele.nugget_id
                        ? classes.activeiconsec
                        : classes.iconsec
                    }
                  >
                    <p
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (getAuthenticated()) {
                          if (isAccountValid()) {
                            if (Comments === ele.nugget_id) {
                              setCommentList([]);
                              setComments("");
                            } else {
                              setCommentList([]);
                              setComments(ele.nugget_id);
                              getCommentList(ele.nugget_id);
                            }
                          } else {
                            dispatch(
                              handleprofileVerifyModalShow({
                                show: true,
                                msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                              })
                            );
                          }
                        } else {
                          dispatch(handleloginModalShow(true));
                        }
                      }}
                    >
                      <i className={`${classes.commentIcon}`} />
                    </p>
                    <span>{ele.total_comments}</span>
                  </div>
                  <div className={classes.iconsec}>
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (getAuthenticated()) {
                          if (isAccountValid()) {
                            console.log("share");
                          } else {
                            dispatch(
                              handleprofileVerifyModalShow({
                                show: true,
                                msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                              })
                            );
                          }
                        } else {
                          dispatch(handleloginModalShow(true));
                        }
                      }}
                    >
                      <i className={`${classes.share_icon}`} />
                    </p>
                    <span>0</span>
                  </div>
                </div>
              </div>

              {Comments === ele.nugget_id && (
                <CommentsList
                  nugget_id={Comments}
                  index={index}
                  CommentList={CommentList}
                />
              )}
            </div>
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
