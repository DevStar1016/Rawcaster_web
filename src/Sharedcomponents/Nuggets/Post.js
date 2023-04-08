import { Dropdown, Modal, Tooltip } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { useInView } from "react-hook-inview";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import SpecificConnectionorGroup from "../../Modal/Nugget/SpecificConnectionorGroup";
import {
  deleteNuggetService,
  likeAndUnlikeNuggetService,
  nuggetCommentListService,
  saveAndUnsaveNuggetService,
  likeAndUnlikeNuggetCommentService,
  shareNuggetService,
  addNuggetViewService,
} from "../../Services/ApiService";
import { SHARED_TYPE } from "../../Shared/Constant";
import {
  SingleNuggetContext,
  useListNuggetContext,
} from "../../Shared/Context";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  dateToShortDate,
  datetoString,
  decodeHtml,
  EncryptionString,
  getAuthenticated,
  getDataValueById,
  isAccountValid,
  isValidData,
  JSONtoformdata,
  ReadMore,
  utctoUserTimezone,
} from "../../Shared/Utility";
import {
  handleLoading,
  handleloginModalShow,
  handlenuggetVideoPaused,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import MultiplePoll from "../../UIComponents/MultiplePoll/MultiplePoll";
import ProfileImg from "../../UIComponents/ProfileImg";
import CommentsList from "./CommentsList";
import classes from "./Nuggets.module.css";

const Post = ({
  ele,
  getList,
  handleLike,
  HandleShare,
  handleSave,
  handleView,
  index,
  muted,
  setmuted,
  onEdit,
}) => {
  const { NuggetList } = useListNuggetContext();
  const lodash = require("lodash");
  const source = useRef(null);
  const Token = useAuthToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userSettings } = useAuth();
  const loginUserData = useAuthData();
  const [Comments, setComments] = useState("");
  const [CommentList, setCommentList] = useState([]);
  const [isCommentLoading, setisCommentLoading] = useState(false);
  const [GrouporConnectionModal, setGrouporConnectionModal] = useState({
    show: false,
    type: "",
    id: "",
  });
  const [iscollapse, setiscollapse] = useState(false);
  const [isvalidContent, setisvalidContent] = useState(false);
  const [isLinkopenModal, setisLinkopenModal] = useState(false);

  const [ref] = useInView({
    threshold: 0,
    onEnter: () => {
      if (Token) {
        viewHandler();
      }
    },
  });

  const viewHandler = () => {
    if (ele.viewed === 0 && Token) {
      let viewNugget = {
        token: Token,
        nugget_id: ele.nugget_id,
      };
      addNuggetViewService(JSONtoformdata(viewNugget))
        .then((res) => {
          handleView(NuggetList);
        })
        .catch((err) => {});
    }
  };

  const deletenugget = (id) => {
    let deleteData = {
      token: Token,
      nugget_id: id,
    };
    deleteNuggetService(JSONtoformdata(deleteData))
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
        dispatch(handleLoading(false));
      });
  };

  const getCommentList = (id) => {
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
      if (ele && ele?.poll_option && ele.poll_option?.length !== 0) {
        let resultData = [
          {
            key: 2,
            label: (
              <div
                onClick={() => {
                  Modal.confirm({
                    title: "Confirmation",
                    okText: "Yes",
                    cancelText: "No",
                    cancelButtonProps: {
                      danger: true,
                    },
                    content: <div>Do you want to delete this nugget? </div>,
                    onOk: () => {
                      deletenugget(ele.nugget_id);
                    },
                  });
                }}
              >
                Delete
              </div>
            ),
          },
        ];
        return resultData;
      } else {
        let resultData = [
          {
            key: 1,
            label: <div onClick={() => onEdit(ele.nugget_id)}>Edit</div>,
          },
          {
            key: 2,
            label: (
              <div
                onClick={() => {
                  Modal.confirm({
                    title: "Confirmation",
                    okText: "Yes",
                    cancelText: "No",
                    cancelButtonProps: {
                      danger: true,
                    },
                    content: <div>Do you want to delete this nugget ? </div>,
                    onOk: () => {
                      deletenugget(ele.nugget_id);
                    },
                  });
                }}
              >
                Delete
              </div>
            ),
          },
        ];
        return resultData;
      }
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
      .then((res) => {})
      .catch((err) => {});
  };

  const HandleSave = (id, save) => {
    let nuggetData = {
      token: Token,
      nugget_id: id,
      save: save,
    };
    saveAndUnsaveNuggetService(
      JSONtoformdata(nuggetData),
      source.current?.token
    )
      .then((res) => {})
      .catch((err) => {});
  };

  const LikeProcess = useCallback(
    () =>
      lodash.debounce(function (nugget_id, like) {
        HandleLike(nugget_id, like);
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const SaveProcess = useCallback(
    () =>
      lodash.debounce(function (nugget_id, like) {
        HandleSave(nugget_id, like);
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNuggetCommentLike = (comment_id, like) => {
    const promise = new Promise((resolve, reject) => {
      let likeData = {
        token: Token,
        comment_id: comment_id,
        like: like,
      };
      likeAndUnlikeNuggetCommentService(JSONtoformdata(likeData))
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          toast.error(err.message);
          reject(err.message);
        });
    });

    return promise;
  };

  const SingleNuggetData = {
    Nuggets: ele,
    nugget_id: Comments,
    CommentList,
    isCommentLoading,
    setCommentList,
    handleNuggetCommentLike,
    getCommentList(id) {
      return getCommentList(id);
    },
  };

  const isReadMore = () => {
    if (ele.media_list.length !== 0) {
      return false;
    } else if (ele.poll_option?.length !== 0) {
      return false;
    }
    return true;
  };

  const isCollapse = () => {
    let isvalidCollapse =
      ele.media_list.length !== 0 || ele.metadata ? true : false;
    if (isvalidCollapse) {
      return false;
    } else if (!isvalidContent) {
      return true;
    } else {
      return false;
    }
  };

  const Handleshare = (id, key, values = null) => {
    Modal.confirm({
      title: "Confirmation",
      okText: "Yes",
      cancelText: "No",
      cancelButtonProps: {
        danger: true,
      },
      content: <div>Do you want to share this nugget ? </div>,
      onOk: () => {
        handlesharepost(id, key, values);
      },
    });
  };

  const handlesharepost = (id, key, values) => {
    let shareData = {
      token: Token,
      share_type: key,
      nugget_id: id,
    };
    if (values) {
      if (key === 3) {
        let groupIds = values.map((ele) => ele.group_id);
        shareData = {
          ...shareData,
          share_with: JSON.stringify({ groups: groupIds }),
        };
      } else {
        let friendIds = values.map((ele) => ele.user_id);
        shareData = {
          ...shareData,
          share_with: JSON.stringify({ friends: friendIds }),
        };
      }
    }

    shareNuggetService(JSONtoformdata(shareData))
      .then((res) => {
        if (res.data.status === 1) {
          getList();
          setGrouporConnectionModal({
            show: false,
            type: "",
          });
          HandleShare();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getNumberofLines = () => {
    if (ele && ele?.poll_option && ele.poll_option?.length !== 0) {
      if (ele.poll_option?.length === 4) {
        return 3;
      } else if (ele.poll_option?.length === 3) {
        return 4;
      } else if (ele.poll_option?.length === 2) {
        return 5;
      }
    }
  };

  return (
    <SingleNuggetContext.Provider value={SingleNuggetData}>
      <div className={classes.nuggetItem}>
        <div className={classes.profilePart}>
          <div className={classes.proImg}>
            <ProfileImg
              isLoggedIn={loginUserData}
              src={ele?.user_image}
              imgClassName={classes.profileimg}
              badgeClassName={classes.badgeImg}
              Badgetype={loginUserData?.user_status_id}
              BadgeTitle={loginUserData?.user_status}
            />
            {/* <img src={ele?.user_image} alt="original_user_image" />

            <i className={classes.viewCount}>{ele?.follow_count}</i> */}
          </div>
          <div className={classes.proName}>
            <p
              onClick={() => {
                navigate(`/viewprofile/${EncryptionString(ele?.user_id)}`);
              }}
            >
              {decodeHtml(ele?.user_name)}{" "}
              {ele?.type === 2 && (
                <span>
                  shared{" "}
                  <span
                    className={classes.sharedUserName}
                    onClick={() => {
                      navigate(
                        `/viewprofile/${EncryptionString(
                          ele?.original_user_id
                        )}`
                      );
                    }}
                  >
                    {ele?.original_user_name}
                  </span>
                  ′s nugget
                </span>
              )}
            </p>
          </div>
          <p className={classes.detailsRange}>
            {ele && (
              <Tooltip
                title={
                  userSettings
                    ? datetoString(
                        utctoUserTimezone(
                          ele.created_date,
                          userSettings.time_zone
                        )
                      )
                    : null
                }
                color="rgb(250, 162, 27)"
              >
                {dateToShortDate(ele?.created_date)}
              </Tooltip>
            )}
            <i class="material-icons">fiber_manual_record</i>
            {ele?.total_views} Views{" "}
            {ele?.share_type === 3 || ele?.share_type === 4 ? (
              <Tooltip
                placement="right"
                color={"#fff"}
                title={() => {
                  return (
                    <div className={classes.TooltipSec}>
                      {ele.shared_detail.map((elem) => (
                        <p>{elem.name}</p>
                      ))}
                    </div>
                  );
                }}
              >
                <i class="material-icons">fiber_manual_record</i>
                {getDataValueById(SHARED_TYPE, ele?.share_type)}
              </Tooltip>
            ) : (
              <>
                <i class="material-icons">fiber_manual_record</i>
                {getDataValueById(SHARED_TYPE, ele?.share_type)}
              </>
            )}
            <i class="material-icons">fiber_manual_record</i>
            {ele?.follow_count} Fans
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
        <div className={classes.contentSec} ref={ref}>
          <div className={classes.feedsSec}>
            {ele && isValidData(ele?.content) && (
              <p style={{ whiteSpace: "pre-wrap", lineBreak: "anywhere" }}>
                <ReadMore
                  isReadMore={isReadMore()}
                  isLinkopenModal={isLinkopenModal}
                  setisLinkopenModal={setisLinkopenModal}
                  partialShowLines={getNumberofLines()}
                  isReadMoreValid={() => {
                    setisvalidContent(true);
                  }}
                >
                  {decodeHtml(ele?.content)}
                </ReadMore>
              </p>
            )}
            {ele.media_list && ele.media_list.length === 0 && ele.metadata ? (
              <div
                className={classes.metaLink}
                onClick={() => {
                  setisLinkopenModal(true);
                }}
              >
                <div className={classes.shareLinkSec}>
                  {JSON.parse(ele.metadata).image !== "" ? (
                    <p className={classes.source}>
                      <i className="material-icons">public</i>
                      {JSON.parse(ele.metadata).source}
                    </p>
                  ) : null}
                  <p
                    className={classes.title}
                    style={{
                      paddingTop:
                        JSON.parse(ele.metadata).image === "" ? "10px" : "0px",
                    }}
                  >
                    {JSON.parse(ele.metadata).title}
                  </p>
                  {JSON.parse(ele.metadata).image &&
                  JSON.parse(ele.metadata).image !== "" ? (
                    <img
                      src={JSON.parse(ele.metadata).image}
                      height="370px"
                      alt="meta_img"
                      style={{
                        objectFit: "cover",
                        maxWidth: "100%",
                        margin: "auto",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    ></img>
                  ) : (
                    <div className={classes.domainName}>
                      {JSON.parse(ele.metadata).source}
                    </div>
                  )}
                  <p className={classes.dec}>
                    {JSON.parse(ele.metadata).description}
                  </p>
                </div>
              </div>
            ) : null}
            <div
              className={classes.imgContainer}
              style={{
                borderRadius:
                  ele && ele?.poll_option && ele.poll_option?.length !== 0
                    ? "0px"
                    : "12px",
              }}
            >
              {ele && ele.media_list && ele.media_list?.length !== 0 && (
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
              )}
              {ele && ele?.poll_option && ele.poll_option?.length !== 0 && (
                <div className={classes.pollContainer}>
                  <MultiplePoll
                    nugget_id={ele.nugget_id}
                    results={ele.poll_option}
                    // isVotedId={11}
                    TotalVotes={ele?.total_vote}
                    isVoted={parseInt(ele?.voted) === 1}
                    created_date={ele.created_date}
                    VoteTiming={ele.poll_duration}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={classes.floattingSec}>
            {(iscollapse || !isCollapse()) && (
              <>
                <div
                  className={
                    ele?.liked ? classes.activeiconsec : classes.iconsec
                  }
                  onClick={() => {
                    if (getAuthenticated()) {
                      if (isAccountValid(loginUserData)) {
                        let like = ele.liked ? 2 : 1;
                        handleLike(like);
                        LikeProcess(ele.nugget_id, like);
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
                  <p>
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
                    onClick={() => {
                      if (getAuthenticated()) {
                        if (isAccountValid(loginUserData)) {
                          if (Comments === ele.nugget_id) {
                            setCommentList([]);
                            setComments("");
                          } else {
                            setisCommentLoading(true);
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

                {ele?.poll_option?.length === 0 && (
                  <div
                    className={classes.iconsec}
                    style={{
                      display: ele.share_type !== 1 ? "none" : "",
                    }}
                  >
                    <Dropdown
                      disabled={!isAccountValid(loginUserData)}
                      menu={{
                        items: SHARED_TYPE,
                        onClick: ({ key }) => {
                          if (parseInt(key) === 3 || parseInt(key) === 4) {
                            setGrouporConnectionModal({
                              show: true,
                              id: ele.nugget_id,
                              type:
                                parseInt(key) === 3
                                  ? "group"
                                  : parseInt(key) === 4 && "connections",
                            });
                          } else {
                            Handleshare(ele.nugget_id, key);
                          }
                        },
                      }}
                    >
                      <p
                        onClick={() => {
                          if (getAuthenticated()) {
                            if (isAccountValid(loginUserData)) {
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
                    </Dropdown>
                    {/* <span>0</span> */}
                  </div>
                )}

                <div
                  className={
                    ele.saved ? classes.activeiconsec : classes.iconsec
                  }
                >
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (getAuthenticated()) {
                        if (isAccountValid(loginUserData)) {
                          let save = ele.saved ? 2 : 1;
                          handleSave(save);
                          SaveProcess(ele.nugget_id, save);
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
                    <i className={`${classes.saveIcon}`} />
                  </p>
                </div>
              </>
            )}
            {isCollapse() && (
              <>
                {iscollapse ? (
                  <div
                    className={classes.iconsec}
                    onClick={() => {
                      setCommentList([]);
                      setComments("");
                      setiscollapse(false);
                    }}
                  >
                    <p>
                      <i class="material-symbols-outlined">expand_more</i>
                    </p>
                  </div>
                ) : (
                  <div
                    className={classes.iconsec}
                    onClick={() => {
                      setiscollapse(true);
                    }}
                  >
                    <p>
                      <i class="material-symbols-outlined">expand_less</i>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <SpecificConnectionorGroup
          open={GrouporConnectionModal.show}
          type={GrouporConnectionModal.type}
          shareWithData={[]}
          share_type={
            GrouporConnectionModal.type === "group"
              ? 3
              : GrouporConnectionModal.type === "connections"
              ? 4
              : ""
          }
          onSuccess={(val) => {
            if (GrouporConnectionModal.type === "group") {
              Handleshare(GrouporConnectionModal.id, 3, val);
            } else if (GrouporConnectionModal.type === "connections") {
              Handleshare(GrouporConnectionModal.id, 4, val);
            }
          }}
          onClose={() => {
            setGrouporConnectionModal({
              show: false,
              type: "",
            });
          }}
        />

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
