import { Dropdown, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  deleteNuggetService,
  likeAndUnlikeNuggetService,
  nuggetCommentListService,
} from "../../Services/ApiService";
import { SHARED_TYPE } from "../../Shared/Constant";
import { SingleNuggetContext } from "../../Shared/Context";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  decodeHtml,
  getAuthenticated,
  getDataValueById,
  isAccountValid,
  isValidData,
  JSONtoformdata,
  ReadMore,
} from "../../Shared/Utility";
import {
  handleLoading,
  handleloginModalShow,
  handlenuggetVideoPaused,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import ImageGrid from "../../UIComponents/ImageGrid";
import CommentsList from "./CommentsList";
import classes from "./Nuggets.module.css";

const Post = ({ ele, getList, handleLike, HandleShare, index }) => {
  var _ = require("lodash");
  const source = useRef(null);
  const Token = useAuthToken();
  const dispatch = useDispatch();
  const loginUserData = useAuthData();

  const [Comments, setComments] = useState("");
  const [muted, setmuted] = useState(false);
  const [CommentList, setCommentList] = useState([]);
  const [isCommentLoading, setisCommentLoading] = useState(false);

  const deletenugget = (id) => {
    let formData = new FormData();
    formData.append("token", Token);
    formData.append("nugget_id", id);

    deleteNuggetService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          getList(1);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        // setDeleteData("");
        dispatch(handleLoading(false));
      });
  };

  const getCommentList = (id) => {
    setisCommentLoading(true);
    let listComment = {
      token: Token,
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

  const handleDelete = () => {
    // setDeleteData(ele.nugget_id);
    deletenugget(ele.nugget_id);
  };

  const handleEdit = () => {
    console.log("edit");
  };

  const handleBlock = () => {
    console.log("Block");
  };

  const handleReport = () => {
    console.log("report");
  };

  const handleShareLink = () => {
    console.log("sharelink");
  };

  const getMoreValues = (ele) => {
    if (ele.user_id === loginUserData?.user_id) {
      let resultData = [
        {
          key: 1,
          label: <div onClick={() => handleEdit()}>Edit</div>,
        },
        {
          key: 2,
          label: <div onClick={() => handleDelete()}>Delete</div>,
        },
      ];
      return resultData;
    } else {
      let resultData = [
        {
          key: 1,
          label: <div onClick={() => handleBlock()}>Block user</div>,
        },
        {
          key: 2,
          label: <div onClick={() => handleReport()}>Report Abuse</div>,
        },
        {
          key: 3,
          label: <div onClick={() => handleShareLink()}>Share Link</div>,
        },
      ];
      return resultData;
    }
  };

  const HandleLike = (id, like) => {
    let nuggetData = {
      token: Token,
      nugget_id: id,
      like: like,
    };
    likeAndUnlikeNuggetService(
      JSONtoformdata(nuggetData),
      source.current?.token
    )
      .then((res) => {
        if (res.data.status === 1) {
          getList();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  var debounceProcess = _.debounce(
    function (nugget_id, like) {
      HandleLike(nugget_id, like);
    },
    1000,
    true
  );

  const SingleNuggetData = {
    nugget_id: Comments,
    CommentList: CommentList,
    setCommentList: setCommentList,
    isCommentLoading: isCommentLoading,
    setCommentList: setCommentList,
    getCommentList(id) {
      return getCommentList(id);
    },
  };

  return (
    <SingleNuggetContext.Provider value={SingleNuggetData}>
      <div className={classes.nuggetItem}>
        <div className={classes.profilePart}>
          <div className={classes.proImg}>
            <img src={ele?.original_user_image} alt="original_user_image" />
            <Tooltip title="Became A Fan" color="#e26386">
              <i className={classes.viewCount}>{ele?.follow_count}</i>
            </Tooltip>
          </div>
          <p className={classes.proName}>
            {decodeHtml(ele?.original_user_name)}
          </p>
          <p className={classes.detailsRange}>
            <Tooltip
              title={dayjs(ele?.created_date).format("DD MMM YYYY - hh:mm  A")}
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
            <p style={{ whiteSpace: "pre-wrap", lineBreak: "anywhere" }}>
              {ele && isValidData(ele?.content) && (
                <ReadMore CharactersLength={120} index={index}>
                  {decodeHtml(ele?.content)}
                </ReadMore>
              )}
            </p>
            <div className={classes.imgContainer}>
              <ImageGrid
                imgArray={ele.media_list}
                muted={muted}
                mutenuggetaudio={setmuted}
                onPlay={() => {
                  let dashboardPlayer = document.getElementById(
                    "dashboard_signup_video"
                  );
                  if (dashboardPlayer) {
                    dashboardPlayer.pause();
                    dispatch(handlenuggetVideoPaused(false));
                  }
                }}
              />
            </div>
          </div>
          <div className={classes.floattingSec}>
            <div
              className={ele?.liked ? classes.activeiconsec : classes.iconsec}
              onClick={() => {
                if (getAuthenticated()) {
                  if (isAccountValid()) {
                    let like = ele.liked ? 2 : 1;
                    handleLike(like);
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
                    if (getAuthenticated()) {
                      if (isAccountValid()) {
                        HandleShare("share");
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
                  HandleShare();
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
    </SingleNuggetContext.Provider>
  );
};

export default Post;
