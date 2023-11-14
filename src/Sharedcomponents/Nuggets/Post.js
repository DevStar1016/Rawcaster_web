/**
 * A component that represents a single post.
 * @param {Object} ele - The post object.
 * @param {Function} handleLike - The function to handle liking/unliking a post.
 * @param {Function} HandleShare - The function to handle sharing a post.
 * @param {Function} handleSave - The function to handle saving/unsaving a post.
 * @param {Function} handleView - The function to handle viewing a post.
 * @param {number} index - The index of the post in the list.
 * @param {boolean} muted - A flag indicating if the post is muted.
 * @param {Function} setmuted - The function to set the muted state of the post.
 */
import { Dropdown, Modal, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  getNuggetDetailService,
  NuggetAbuseReportService,
} from "../../Services/ApiService";
import { NUGGET_SHARE_URL, SHARED_TYPE } from "../../Shared/Constant";
import {
  SingleNuggetContext,
  useListNuggetContext,
} from "../../Shared/Context";
import {
  useAuth,
  useAuthData,
  useAuthToken,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import {
  dateToShortDate,
  datetoString,
  decodeHtml,
  getAuthenticated,
  getDataValueById,
  handleProfileNavigate,
  isAccountValid,
  isValidData,
  JSONtoformdata,
  ReadMore,
  utctoUserTimezone,
} from "../../Shared/Utility";
import {
  handleLoading,
  handleloginModalShow,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import MultiplePoll from "../../UIComponents/MultiplePoll/MultiplePoll";
import CommentsList from "./CommentsList";
import classes from "./Nuggets.module.css";
import {
  handleDeleteNuggetList,
  handleDeleteNuggetListByUserId,
  handleNuggetFollowingUpdate,
  handleNuggetList,
  handlenuggetVideoPaused,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import _debounce from "lodash/debounce";
import { HandleBecameaFan } from "../../Shared/SharedAPIs";
import ReportGroup from "../../Modal/Report/ReportGroup";
import { blockunblockuserService } from "../../Services/ApiService";
import { ReadoutSec, SeeTranslate } from "./Utility";
import AgreedusersListModal from "../../Modal/Nugget/AgreedusersListModal";
import DiamonVerified from "../../Assets/Icons/svg/diamond_verified.svg";
import ProfileImg from "../../UIComponents/ProfileImg";
import { isArray, isObject } from "lodash";

const Post = ({
  ele,
  handleLike,
  HandleShare,
  handleSave,
  handleView,
  index,
  muted,
  setmuted,
  onEdit,
  isCommentShow = false,
  onDelete,
  onSaveCountResult,
  Opened,
}) => {
  const { setNuggetCount } = useListNuggetContext();
  const source = useRef(null);
  const contentRef = useRef(null);
  const contentTextRef = useRef(null);
  const Token = useAuthToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userSettings } = useAuth();
  const loginUserData = useAuthData();
  const [isTranslate, setisTranslate] = useState(false);
  const { nuggetFormData, Nuggets } = useNuggets();
  const [Comments, setComments] = useState("");
  const [CommentList, setCommentList] = useState([]);
  const [isCommentLoading, setisCommentLoading] = useState(false);
  const [AgreedUsersList, setAgreedUsersList] = useState({
    show: false,
    formData: {},
  });
  const [GrouporConnectionModal, setGrouporConnectionModal] = useState({
    show: false,
    type: "",
    id: "",
  });
  const [iscollapse, setiscollapse] = useState(false);
  const [isvalidContent, setisvalidContent] = useState(false);
  const [isLinkopenModal, setisLinkopenModal] = useState(false);
  const [isReport, setisReport] = useState(false);

  const [ref] = useInView({
    onEnter: () => {
      if (handleView && ele?.viewed === 0) {
        handleView(index);
      }
    },
  });

  /**
   * useEffect hook that checks the length of the content and poll options of an element
   * and sets the value of iscollapse accordingly.
   * @param {Object} ele - The element object to check.
   * @returns None
   */
  useEffect(() => {
    if (ele) {
      if (ele?.content?.split("\n")?.length > 10) {
        setiscollapse(true);
      } else if (ele?.content?.length > 500) {
        setiscollapse(true);
      } else if (
        (ele?.content?.length > 300 && ele?.poll_option?.length > 1) ||
        (ele?.content?.split("\n").length > 3 && ele?.poll_option?.length > 1)
      ) {
        setiscollapse(true);
      } else {
        setiscollapse(false);
      }
    }
  }, []);
  /**
   * useEffect hook that sets the value of `iscollapse` to `true` if `Opened` is true.
   * This effect runs only once, when the component is mounted.
   * @returns None
   */

  useEffect(() => {
    if (Opened) {
      setiscollapse(true);
    }
  }, []);

  /**
   * Retrieves the details of a nugget using the nugget ID and updates the total_comments
   * property of the corresponding nugget in the Nuggets array.
   * @returns None
   */
  const getNuggetDetail = () => {
    let nuggetDetailData = {
      token: Token,
      nugget_id: ele.nugget_id,
    };
    getNuggetDetailService(JSONtoformdata(nuggetDetailData))
      .then((res) => {
        if (res.data.status === 1) {
          let findIndex = Nuggets.findIndex(
            (elem) => elem.nugget_id === ele.nugget_id
          );
          let updateData = [...Nuggets];
          updateData[findIndex] = {
            ...updateData[findIndex],
            total_comments: res.data.nugget_detail.total_comments,
          };
          dispatch(handleNuggetList(updateData));
        }
      })
      .catch((err) => {});
  };

  /**
   * Deletes a nugget with the given ID.
   * @param {number} id - The ID of the nugget to delete.
   * @returns None
   */
  const deletenugget = (id) => {
    let deleteData = {
      token: Token,
      nugget_id: id,
    };
    deleteNuggetService(JSONtoformdata(deleteData))
      .then((res) => {
        if (res.data.status === 1) {
          if (onDelete) {
            onDelete();
          }
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  /**
   * useEffect hook that is triggered when the value of isCommentShow or ele.nugget_id changes.
   * If isCommentShow is true and ele is defined, it sets isCommentLoading to true, clears the comment list,
   * and retrieves the comments for the given nugget_id. It also retrieves the comment list for the given nugget_id.
   * @returns None
   */
  useEffect(() => {
    if (isCommentShow && ele) {
      setisCommentLoading(true);
      setCommentList([]);
      setComments(ele.nugget_id);
      if (ele.nugget_id) {
        getCommentList(ele.nugget_id);
      }
    }
  }, [isCommentShow, ele.nugget_id]);

  /**
   * Retrieves the list of comments for a given ID using an API call.
   * @param {number} id - The ID of the nugget to retrieve comments for.
   * @returns {Promise} - A promise that resolves with the list of comments.
   */
  const getCommentList = (id) => {
    let promise = new Promise((resolve, reject) => {
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
          resolve();
        })
        .catch((err) => {})
        .finally(() => {
          setisCommentLoading(false);
        });
    });
    return promise;
  };

  /**
   * Handles blocking a user with the given ID.
   * @param {number} id - The ID of the user to block.
   * @returns None
   */
  const handleBlock = (id) => {
    let BlockData = {
      token: Token,
      user_id: id,
      action: 1,
    };
    blockunblockuserService(JSONtoformdata(BlockData)).then((res) => {
      if (res.data.status === 1) {
        toast.remove("rawcaster");
        toast.success(res.data.msg, { id: "rawcaster" });
        dispatch(handleDeleteNuggetListByUserId(id));
      } else {
        toast.remove("rawcaster");
        toast.error(res.data.msg, { id: "rawcaster" });
      }
    });
  };

  /**
   * Handles the reporting of abuse for a given value.
   * @param {any} val - The value to report abuse for.
   * @returns None
   */
  const handleReport = (val) => {
    let abuseData = {
      token: Token,
      nugget_id: ele.nugget_id,
      ...val,
    };
    NuggetAbuseReportService(JSONtoformdata(abuseData)).then((res) => {
      if (res.data.status === 1) {
        toast.remove("rawcaster");
        toast.success(res.data.msg, { id: "rawcaster" });
        dispatch(handleDeleteNuggetList(ele.nugget_id));
      } else {
        toast.remove("rawcaster");
        toast.error(res.data.msg, { id: "rawcaster" });
      }
    });
  };

  /**
   * Returns an array of objects containing key-value pairs based on the given element.
   * @param {any} ele - The element to process.
   * @returns {Array} An array of objects containing key-value pairs.
   */
  const getMoreValues = (ele) => {
    if (ele.user_id === loginUserData?.user_id) {
      if (!Opened) {
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
        } else if (ele.type === 2) {
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
            {
              key: 3,
              label: (
                <div
                  onClick={() => {
                    const el = document.createElement("input");
                    el.value = NUGGET_SHARE_URL + window.btoa(ele.nugget_id);
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                    toast.remove("rawcaster");
                    toast.success("Link copied to clipboard", {
                      id: "rawcaster",
                    });
                  }}
                  className={classes.dropdownItem}
                >
                  Share Link
                </div>
              ),
            },
          ];
          return resultData;
        }
      } else {
        return [];
      }
    } else {
      let resultData = [
        {
          key: 1,
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
                  content: (
                    <div>Are You Sure Do you want to Block this user ? </div>
                  ),
                  onOk: () => {
                    handleBlock(ele.user_id);
                  },
                });
              }}
              className={classes.dropdownItem}
            >
              <span className="material-symbols-outlined">block</span> Block
              User
            </div>
          ),
        },
        {
          key: 2,
          label: (
            <div
              onClick={() => {
                setisReport(true);
              }}
              className={classes.dropdownItem}
            >
              <span className="material-symbols-outlined">report</span> Report
              Abuse
            </div>
          ),
        },
        {
          key: 3,
          label: (
            <div
              onClick={() => {
                console.log(ele);
                HandleBecameaFan(Token, ele.user_ref_id)
                  .then(() => {
                    dispatch(
                      handleNuggetFollowingUpdate({
                        user_id: ele.user_id,
                        nugget_id: ele.nugget_id,
                        following: !ele.following,
                      })
                    );
                  })
                  .catch(() => {});
              }}
              className={classes.dropdownItem}
            >
              <span className="material-symbols-outlined">group</span>Become a
              Fan
            </div>
          ),
        },
        {
          key: 4,
          label: (
            <div
              onClick={() => {
                const el = document.createElement("input");
                el.value = NUGGET_SHARE_URL + window.btoa(ele.nugget_id);
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
                toast.remove("rawcaster");
                toast.success("Link copied to clipboard", { id: "rawcaster" });
              }}
              className={classes.dropdownItem}
            >
              <span className={classes.share_link_icon}></span>Share Link
            </div>
          ),
        },
      ];
      resultData.map((elem) => {
        if (ele.type === 2) {
          resultData = resultData.filter((val) => parseInt(val.key) !== 4);
        }
        if (ele?.following) {
          resultData = resultData.filter((val) => parseInt(val.key) !== 3);
        }
      });

      return resultData;
    }
  };

  /**
   * Handles the like functionality for a specific nugget.
   * @param {string} id - The ID of the nugget.
   * @param {boolean} like - Indicates whether the user is liking or unliking the nugget.
   * @returns None
   */
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

  /**
   * Handles saving or unsaving a nugget.
   * @param {string} id - The ID of the nugget to save or unsave.
   * @param {boolean} save - Indicates whether to save or unsave the nugget.
   * @returns None
   */
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
      .then((res) => {
        if (res.data.status === 1)
          if (onSaveCountResult) {
            onSaveCountResult(res.data.saved_nugget_count);
          }
      })
      .catch((err) => {});
  };

  /**
   * Creates a debounced version of the HandleLike function using the useCallback hook.
   * The debounced function will be called after a delay of 1000 milliseconds.
   * @param {function} HandleLike - The function to be debounced.
   * @returns {function} - The debounced version of the HandleLike function.
   */
  const LikeProcess = useCallback(
    _debounce(HandleLike, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Token]
  );

  /**
   * Creates a debounced version of the HandleSave function that will be called after a delay of 1000 milliseconds.
   * The debounced function is memoized using useCallback to prevent unnecessary re-renders.
   * @param {function} HandleSave - The function to be debounced.
   * @returns {function} - The debounced version of the HandleSave function.
   */
  const SaveProcess = useCallback(
    _debounce(HandleSave, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Token]
  );

  /**
   * Handles the liking or unliking of a nugget comment.
   * @param {string} comment_id - The ID of the comment to like or unlike.
   * @param {boolean} like - Indicates whether to like or unlike the comment.
   * @returns {Promise} A promise that resolves with the response data if successful, or rejects with an error message if an error occurs.
   */
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
          reject(err.message);
        });
    });

    return promise;
  };

  /**
   * An object that contains various properties and methods related to single nugget data.
   * @property {ele} Nuggets - The nuggets element.
   * @property {Comments} nugget_id - The ID of the nugget's comments.
   * @property {CommentList} CommentList - The list of comments for the nugget.
   * @property {boolean} isCommentLoading - Indicates if the comments are currently being loaded.
   * @property {function} setCommentList - A function to set the comment list.
   * @property {function} handleNuggetCommentLike - A function to handle the like action on a nugget comment.
   * @property {function} setAgreedUsersList - A function to set the list of
   */
  const SingleNuggetData = {
    Nuggets: ele,
    nugget_id: Comments,
    CommentList,
    isCommentLoading,
    setCommentList,
    handleNuggetCommentLike,
    setAgreedUsersList,
    getNuggetDetail,
    isTranslate,
    setisTranslate,
    getCommentList(id) {
      return getCommentList(id);
    },
  };

  /**
   * Determines if the given element is a "Read More" section based on its properties.
   * @returns {boolean} - true if the element is a "Read More" section, false otherwise.
   */
  const isReadMore = () => {
    if (ele.media_list?.length !== 0) {
      return false;
    } else if (
      ele.poll_option?.length > 2 &&
      contentTextRef?.current?.offsetHeight > 75
    ) {
      return false;
    } else if (
      ele.poll_option?.length > 0 &&
      contentTextRef?.current?.offsetHeight > 100
    ) {
      return false;
    } else if (ele?.content?.split("\n")?.length > 10) {
      return false;
    }
    return true;
  };

  /**
   * Determines whether an element should be collapsed or not based on various conditions.
   * @returns {boolean} - True if the element should be collapsed, false otherwise.
   */
  const isCollapse = () => {
    let isvalidCollapse =
      ele.media_list?.length !== 0 || ele.metadata ? true : false;

    if (Opened) {
      return false;
    }
    if (isvalidCollapse) {
      return false;
    }
    if (ele?.content?.split("\n")?.length > 10) {
      return false;
    } else if (
      (ele?.content?.length > 300 && ele?.poll_option?.length > 1) ||
      (ele?.content?.split("\n").length > 3 && ele?.poll_option?.length > 1)
    ) {
      return false;
    } else if (!isvalidContent) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Handles the share action for a nugget.
   * @param {string} id - The ID of the nugget to share.
   * @param {string} key - The key for the share action.
   * @param {any} [values=null] - Additional values to pass to the share action.
   * @returns None
   */
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

  /**
   * Handles sharing a post with the specified ID, key, and values.
   * @param {number} id - The ID of the post to share.
   * @param {string} key - The type of sharing (e.g. group, friend).
   * @param {Array} values - The values associated with the sharing (e.g. group IDs, friend IDs).
   * @returns None
   */
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
          setGrouporConnectionModal({
            show: false,
            type: "",
          });
          HandleShare();
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Determines the number of lines based on the conditions of the given element.
   * @returns {number | undefined} - The number of lines based on the conditions of the element.
   */
  const getNumberofLines = () => {
    if (ele && ele?.poll_option && ele.poll_option?.length !== 0) {
      if (ele.poll_option?.length === 4) {
        return 3;
      } else if (ele.poll_option?.length === 3) {
        return 4;
      } else if (ele.poll_option?.length === 2) {
        return 5;
      }
    } else {
      return 10;
    }
  };

  /**
   * Calculates the total length of comments in a given data array, including replies.
   * @param {Array} data - The array of data containing comments and replies.
   * @returns {number} - The total length of comments, including replies.
   */
  const getcommentLength = (data) => {
    let count = 0;
    const commentlength = data?.map((item, index) => {
      count += item?.reply?.length;
      return item;
    });

    return count + data?.length;
  };

  /**
   * Determines if the element is downloadable based on its share type.
   * @returns {number} - 1 if the element is downloadable, 2 otherwise.
   */

  const getisDownloadable = () => {
    if (ele && ele?.share_type === 1) {
      return 1;
    } else {
      return 2;
    }
  };

  const MetaDataContent = (elem, isPopover = false) => {
    if (elem && isPopover) {
      console.log(elem, "elem");
      return (
        <div
          className={classes.PopoverShareLink}
          onClick={() => {
            setisLinkopenModal(true);
          }}
        >
          <div>
            <p
              className={classes.title}
              style={{
                paddingTop:
                  !elem.open_graph_image || elem.open_graph_image === ""
                    ? "10px"
                    : "0px",
              }}
            >
              {elem.title}
            </p>
            {elem.open_graph_image && elem.open_graph_image !== "" ? (
              <img
                src={elem.open_graph_image}
                alt="meta_img"
                style={{
                  objectFit: "cover",
                  maxWidth: "100%",
                  height: 370,
                  margin: "auto",
                  justifyContent: "center",
                  display: "flex",
                }}
              ></img>
            ) : (
              <div className={classes.domainName}>{elem.source}</div>
            )}
            <p className={classes.dec}>{elem.description}</p>
          </div>

          {/* <div className={classes.shareLinkSec}>
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
          </div> */}
        </div>
      );
    } else if (elem && !isPopover) {
      return (
        <div
          className={classes.metaLink}
          onClick={() => {
            setisLinkopenModal(true);
          }}
        >
          <div className={classes.shareLinkSec}>
            {elem.open_graph_image !== "" ? (
              <p className={classes.source}>
                <i className="material-icons">public</i>
                {elem.source}
              </p>
            ) : null}
            <p
              className={classes.title}
              style={{
                paddingTop: elem.open_graph_image === "" ? "10px" : "0px",
              }}
            >
              {elem.title}
            </p>
            {elem.open_graph_image && elem.open_graph_image !== "" ? (
              <img
                src={elem.open_graph_image}
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
              <div className={classes.domainName}>{elem.source}</div>
            )}
            <p className={classes.dec}>{elem.description}</p>
          </div>
        </div>
      );
    }
    return <></>;
  };

  return (
    <SingleNuggetContext.Provider value={SingleNuggetData}>
      {ele ? (
        <div className={classes.nuggetItem}>
          <div className={classes.profilePart}>
            <div className={classes.proImg}>
              <ProfileImg
                isLoggedIn={loginUserData}
                src={ele?.user_image}
                user={ele}
                imgClassName={classes.profileimg}
                badgeClassName={classes.badgeImg}
                Badgetype={ele?.user_status_id}
                BadgeTitle={ele?.user_status}
              />
              {/* <img src={ele?.user_image} alt="original_user_image" />

            <i className={classes.viewCount}>{ele?.follow_count}</i> */}
            </div>
            <div className={classes.proName}>
              <p
                onClick={() => {
                  let finalData = {
                    dispatch,
                    navigate,
                    nuggetFormData,
                    user_id: ele?.user_id,
                  };
                  handleProfileNavigate(finalData);
                }}
              >
                <p>{decodeHtml(ele?.user_name)}</p>{" "}
                {ele?.type === 2 && (
                  <span>
                    shared{" "}
                    <span
                      className={classes.sharedUserName}
                      onClick={() => {
                        let finalData = {
                          dispatch,
                          navigate,
                          nuggetFormData,
                          user_id: ele?.original_user_id,
                        };
                        handleProfileNavigate(finalData);
                      }}
                    >
                      {ele?.original_user_name}
                    </span>
                    ′s nugget
                  </span>
                )}
              </p>
              <img
                src={DiamonVerified}
                className={classes.verifiedImg}
                style={{
                  display: ele?.account_verify_type === 1 ? "block" : "none",
                }}
              />
            </div>
            <p className={classes.detailsRange}>
              {ele && (
                <Tooltip
                  title={
                    userSettings
                      ? datetoString(
                          utctoUserTimezone(
                            ele.created_date,
                            userSettings?.time_zone
                          )
                        )
                      : null
                  }
                  color="rgb(250, 162, 27)"
                >
                  {dateToShortDate(ele.created_date, userSettings?.time_zone)}
                </Tooltip>
              )}
              <i className="material-icons">fiber_manual_record</i>
              {ele?.total_views} Views{" "}
              {(ele?.share_type === 3 || ele?.share_type === 4) &&
              ele.shared_detail &&
              ele.shared_detail.length !== 0 ? (
                <Tooltip
                  placement="right"
                  color={"#fff"}
                  title={
                    ele.shared_detail?.length > 0
                      ? () => {
                          return (
                            <div className={classes.TooltipSec}>
                              {ele.shared_detail.map((elem) => (
                                <p>{elem.name}</p>
                              ))}
                            </div>
                          );
                        }
                      : ""
                  }
                >
                  <i className="material-icons">fiber_manual_record</i>
                  {getDataValueById(SHARED_TYPE, ele?.share_type)}
                </Tooltip>
              ) : (
                <>
                  <i className="material-icons">fiber_manual_record</i>
                  {getDataValueById(SHARED_TYPE, ele?.share_type)}
                </>
              )}
              <i className="material-icons">fiber_manual_record</i>
              {ele?.follow_count} Fans
            </p>
          </div>
          {Token && getMoreValues(ele).length !== 0 && (
            <Dropdown
              placement="bottomRight"
              menu={{
                items: getMoreValues(ele),

                selectable: false,
              }}
            >
              <div className={classes.dropMenu}>
                <span className="material-icons">more_horiz</span>
              </div>
            </Dropdown>
          )}
          {ele && isValidData(ele?.content) && loginUserData ? (
            <div className={classes.ReadoutSec}>
              <SeeTranslate
                nugget_id={ele.nugget_id}
                translate_text={ele.translate_text}
              />
              <ReadoutSec
                nugget_id={ele.nugget_id}
                readout_url={ele.readout_url}
              />
            </div>
          ) : (
            <div className={`${classes.ReadoutSec} py-2`}></div>
          )}
          <div className={classes.contentSec} ref={ref}>
            <div ref={contentRef} className={classes.feedsSec}>
              {ele && isValidData(ele?.content) && (
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                  ref={contentTextRef}
                  onClick={() => {}}
                >
                  <ReadMore
                    MetaDataContent={(url) => {
                      if (ele.metadata) {
                        if (isArray(JSON.parse(ele.metadata))) {
                          const FindMetaData = JSON.parse(ele.metadata).find(
                            (elem) => elem.url === url
                          );
                          console.log(FindMetaData, "FindMetaData");
                          if (FindMetaData) {
                            return MetaDataContent(FindMetaData, true);
                          }
                        } else if (isObject(JSON.parse(ele.metadata))) {
                          if (JSON.parse(ele.metadata)) {
                            return MetaDataContent(
                              JSON.parse(ele.metadata),
                              true
                            );
                          }
                        }
                      }
                    }}
                    isReadMore={isReadMore()}
                    isMetaDataAvailable={ele.metadata}
                    isLinkopenModal={isLinkopenModal}
                    setisLinkopenModal={setisLinkopenModal}
                    partialShowLines={getNumberofLines()}
                    partialHeight={getNumberofLines()}
                    onExpand={(status) => {
                      setiscollapse(status);
                    }}
                    isReadMoreValid={() => {
                      setisvalidContent(true);
                    }}
                  >
                    {ele?.translate_text && isTranslate
                      ? decodeHtml(ele?.translate_text)
                      : decodeHtml(ele?.content)}
                  </ReadMore>
                </p>
              )}

              {ele.media_list && ele.media_list?.length === 0 && ele.metadata
                ? MetaDataContent(
                    ele.metadata
                      ? isArray(JSON.parse(ele.metadata))
                        ? JSON.parse(ele.metadata)[0]
                        : isObject(JSON.parse(ele.metadata))
                        ? JSON.parse(ele.metadata)
                        : null
                      : null,
                    ele.media_list &&
                      ele.media_list?.length !== 0 &&
                      ele.metadata
                  )
                : null}
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
                    downloadable={getisDownloadable()}
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
                  >
                    <p
                      onClick={() => {
                        if (getAuthenticated()) {
                          if (isAccountValid(loginUserData)) {
                            let like = ele.liked ? 2 : 1;
                            handleLike(like);
                            try {
                              LikeProcess(ele.nugget_id, like);
                            } catch (error) {}
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
                      <i className={`${classes.inactive_like_icon}`} />
                    </p>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (parseInt(ele.total_likes) !== 0) {
                          setAgreedUsersList({
                            show: true,
                            formData: {
                              id: ele.nugget_id,
                              type: 1,
                            },
                          });
                        }
                      }}
                    >
                      {ele.total_likes}
                    </span>
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
                        if (!isCommentShow) {
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
                        }
                      }}
                    >
                      <i className={`${classes.commentIcon}`} />
                    </p>
                    <span>
                      {Opened
                        ? getcommentLength(CommentList)
                        : ele?.total_comments}
                    </span>
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
                        <i className="material-symbols-outlined">expand_more</i>
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
                        <i className="material-symbols-outlined">expand_less</i>
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
          {isReport && (
            <ReportGroup
              open={isReport}
              msg="Report this Nugget to Rawcaster"
              onSuccess={(val) => {
                handleReport(val);
                setisReport(false);
              }}
              close={() => {
                setisReport(false);
              }}
            />
          )}
          {Comments === ele.nugget_id && (
            <CommentsList
              nugget_id={Comments}
              index={index}
              CommentList={CommentList}
            />
          )}
        </div>
      ) : (
        <></>
      )}
      {AgreedUsersList.show && (
        <AgreedusersListModal
          open={AgreedUsersList.show}
          formData={AgreedUsersList.formData}
          close={() => {
            setAgreedUsersList({
              show: false,
              formData: {},
            });
          }}
        />
      )}
    </SingleNuggetContext.Provider>
  );
};

export default Post;
