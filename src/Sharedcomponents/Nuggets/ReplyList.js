/**
 * A React component that displays a list of replies to a comment.
 * @param {boolean} isReplyEnabled - Indicates whether the reply section is enabled or not.
 * @param {number} comment_id - The ID of the comment.
 * @param {number} [index=0] - The index of the comment in the list.
 * @param {function} setisReplyEnabled - A function to set the reply section enabled or disabled.
 * @returns The ReplyList component.
 */
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  addNuggetCommentService,
  deleteNuggetCommentService,
  editNuggetCommentService,
} from "../../Services/ApiService";
import {
  dateToShortDate,
  decodeHtml,
  isValidData,
  JSONtoformdata,
} from "../../Shared/Utility";
import classes from "./Nuggets.module.css";
import sendicon from "../../Assets/Images/svg/sendicon.svg";
import emoji from "../../Assets/Images/svg/emoji.svg";
import { Dropdown, Input, Popover } from "antd";
import { useAuth, useAuthData } from "../../Shared/Reduxfetcher";
import { useSingleNuggetContext } from "../../Shared/Context";
import EmojiPicker from "../../UIComponents/EmojiPicker";
import { defaultprofileImg } from "../../Shared/CommonConstants";

const ReplyList = ({
  isReplyEnabled,
  comment_id,
  index = 0,
  setisReplyEnabled,
}) => {
  const {
    nugget_id,
    CommentList,
    getCommentList,
    isCommentLoading,
    getNuggetDetail,
    handleNuggetCommentLike,
    setAgreedUsersList,
    setCommentList,
  } = useSingleNuggetContext();
  const { userSettings } = useAuth();
  const loginUserData = useAuthData();
  const [ReplyTxt, setReplyTxt] = useState([]);
  const [ReplyList, setReplyList] = useState([]);
  const [isActiveEdit, setisActiveEdit] = useState("");
  const [EditData, seteditData] = useState([]);

  useEffect(() => {
    const findReply = CommentList.find(
      (ele) => parseInt(ele.comment_id) === parseInt(comment_id)
    );
    if (findReply) {
      setReplyList(findReply.reply);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CommentList]);

  /**
   * Adds a comment for a specific nugget.
   * @param {number} id - The ID of the nugget.
   * @param {string} comment - The comment to add.
   * @param {number} [type=2] - The type of the comment.
   * @returns None
   */
  const AddCommentforAnugget = (id, comment, type = 2) => {
    let addComment = {
      token: loginUserData?.token,
      type: type,
      nugget_id: id,
      comment_id: comment_id,
      comment: comment,
    };
    addNuggetCommentService(JSONtoformdata(addComment))
      .then((res) => {
        if (res.data.status === 1) {
          getCommentList(id);
          getNuggetDetail();
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Edits a comment for a specific nugget.
   * @param {number} id - The ID of the comment to edit.
   * @param {string} comment - The updated comment text.
   * @param {number} [type=1] - The type of comment (default is 1).
   * @returns None
   */
  const EditCommentforAnugget = (id, comment, type = 1) => {
    let editComment = {
      token: loginUserData?.token,
      comment_id: id,
      comment: comment,
    };
    editNuggetCommentService(JSONtoformdata(editComment))
      .then((res) => {
        if (res.data.status === 1) {
          setisActiveEdit("");
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Handles the deletion of a nugget comment.
   * @param {number} comment_id - The ID of the comment to be deleted.
   * @returns None
   */
  const handleDeleteNuggetComment = (comment_id) => {
    let deleteComment = {
      token: loginUserData?.token,
      comment_id: comment_id,
    };
    deleteNuggetCommentService(JSONtoformdata(deleteComment))
      .then((res) => {
        if (res.data.status === 1) {
          getCommentList(nugget_id);
          getNuggetDetail();
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Retrieves the value of a comment based on its comment ID.
   * @param {number} comment_id - The ID of the comment to retrieve the value for.
   * @returns The value of the comment with the specified comment ID, or undefined if no comment is found.
   */
  const getCommentValue = (comment_id) => {
    let findData = ReplyList.find((ele) => ele.comment_id === comment_id);
    return findData;
  };

  /**
   * Handles the agree action for a comment.
   * @param {number} id - The ID of the comment.
   * @param {boolean} like - Indicates whether the comment is liked or not.
   * @param {number} count - The current like count of the comment.
   * @returns None
   */
  const handleAgree = (id, like, count) => {
    let findIndex = ReplyList.findIndex((ele) => ele.comment_id === id);
    let tempData = [...ReplyList];
    tempData[findIndex] = {
      ...tempData[findIndex],
      liked: !like,
      like_count: !like ? count + 1 : count - 1,
    };
    // setReplyList(tempData);
    updateCommentList([...tempData]);

    let likeflag = like ? 2 : 1;
    handleNuggetCommentLike(id, likeflag)
      .then((res) => {
        if (res.status === 0) {
          let tempData = [...ReplyList];
          tempData[findIndex] = {
            ...tempData[findIndex],
            liked: like,
            like_count: count,
          };
          // setReplyList(tempData);
          updateCommentList([...tempData]);
        }
      })
      .catch((err) => {
        let tempData = [...ReplyList];
        tempData[findIndex] = {
          ...tempData[findIndex],
          liked: like,
          like_count: count,
        };
        // setReplyList(tempData);
        updateCommentList([...tempData]);
      });
  };

  const updateCommentList = (replyList) => {
    let findIndex = CommentList.findIndex(
      (ele) => ele.comment_id === comment_id
    );
    let tempData = [...CommentList];
    tempData[findIndex] = {
      ...tempData[findIndex],
      reply: [...replyList],
    };

    setCommentList(tempData);
  };

  return ReplyList.length !== 0 || isReplyEnabled ? (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        marginTop: "15px",
        marginBottom: "10px",
      }}
    >
      <div className={classes.cmtSec} style={{ width: "90%" }}>
        {isCommentLoading ? null : (
          // <div className="d-flex justify-content-center align-items-center py-2">
          //   <Spin
          //     size="large"
          //     spinning={true}
          //     style={{ textAlign: "center" }}
          //   ></Spin>
          // </div>
          <div>
            {ReplyList.length !== 0 ? (
              <>
                {ReplyList.map((elem, ind) => {
                  return (
                    <>
                      {isActiveEdit === elem.comment_id ? (
                        <div className={classes.comtArea}>
                          <div className={classes.proImg}>
                            <img
                              src={loginUserData?.profile_image}
                              alt="profile_image"
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = defaultprofileImg;
                              }}
                            />
                          </div>
                          <div className={classes.textBox}>
                            <div className={classes.inputSec}>
                              <Input.TextArea
                                placeholder="Write your Comment here..."
                                value={decodeHtml(
                                  getCommentValue(elem.comment_id).comment
                                )}
                                onChange={(e) => {
                                  let editData = {
                                    ...getCommentValue(elem.comment_id),
                                    comment: e.target.value,
                                  };
                                  let tempData = [...ReplyList];
                                  tempData[ind].comment = e.target.value;
                                  // setReplyList(tempData);
                                  updateCommentList([...tempData]);

                                  let findData = EditData.findIndex(
                                    (ele) => ele.comment_id === elem.comment_id
                                  );
                                  if (findData !== -1) {
                                    let tempEdit = [...EditData];
                                    tempEdit[findData] = editData;
                                    seteditData(tempEdit);
                                  } else {
                                    if (EditData.length === 0) {
                                      seteditData([editData]);
                                    } else {
                                      seteditData((pre) => [...pre, editData]);
                                    }
                                  }
                                }}
                              />
                              <Popover
                                getPopupContainer={(trigger) =>
                                  trigger.parentElement
                                }
                                overlayClassName="emojipopover"
                                content={
                                  <div>
                                    <EmojiPicker
                                      emojiButtonColors={["#364157"]}
                                      emojiButtonRadius="8px"
                                      skinTonePosition="none"
                                      previewPosition="none"
                                      // onClickOutside={() => {
                                      //   setShowEmojis(!showEmojis);
                                      // }}
                                      categories={[
                                        "people",
                                        "nature",
                                        "foods",
                                        "activity",
                                        "places",
                                        "objects",
                                        "symbols",
                                        "flags",
                                      ]}
                                      onEmojiSelect={(e) => {
                                        let tempData = [...ReplyList];
                                        tempData[ind].comment = tempData[
                                          ind
                                        ].comment.concat(e.native);
                                        // setReplyList(tempData);
                                        updateCommentList([...tempData]);

                                        let editData = {
                                          ...getCommentValue(elem.comment_id),
                                          comment: getCommentValue(
                                            elem.comment_id
                                          ).comment.concat(e.native),
                                        };
                                        let findIndex = EditData.findIndex(
                                          (ele) =>
                                            ele.comment_id === elem.comment_id
                                        );
                                        if (findIndex !== -1) {
                                          let tmpData = [...EditData];
                                          tmpData[findIndex] = editData;
                                          seteditData(tmpData);
                                        } else {
                                          if (EditData.length === 0) {
                                            seteditData([editData]);
                                          } else {
                                            seteditData((pre) => [
                                              ...pre,
                                              editData,
                                            ]);
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                }
                                trigger="click"
                              >
                                <img
                                  className={classes.emojiicon}
                                  alt="emoji"
                                  src={emoji}
                                />
                              </Popover>

                              <img
                                className={classes.sendicon}
                                src={sendicon}
                                alt="send_icon"
                                onClick={() => {
                                  let findData = EditData.find(
                                    (ele) => ele.comment_id === elem.comment_id
                                  );

                                  if (findData) {
                                    if (isValidData(findData.comment)) {
                                      EditCommentforAnugget(
                                        elem.comment_id,
                                        findData.comment
                                      );
                                    } else {
                                      toast.remove("rawcaster");
                                      toast.error(
                                        "Please Enter Valid Comment",
                                        { id: "rawcaster" }
                                      );
                                    }
                                  } else {
                                    setisActiveEdit("");
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <span
                            className={`material-symbols-outlined ${classes.closeIcon}`}
                            onClick={() => {
                              setisActiveEdit(null);
                            }}
                          >
                            close
                          </span>
                        </div>
                      ) : (
                        <div className={classes.item}>
                          <div className={classes.proImg}>
                            <img
                              src={elem?.profile_image}
                              alt={elem?.name}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = defaultprofileImg;
                              }}
                            />
                          </div>
                          <div className={classes.rightitem}>
                            <div className="d-flex flex-row">
                              <div className={classes.cmtText}>
                                <p>{elem?.name}</p>
                                <span>{decodeHtml(elem?.comment)}</span>
                              </div>
                              {elem.user_id === loginUserData.user_id && (
                                <Dropdown
                                  menu={{
                                    items: [
                                      {
                                        label: (
                                          <div
                                            onClick={() => {
                                              setisActiveEdit(elem.comment_id);
                                            }}
                                          >
                                            Edit
                                          </div>
                                        ),
                                        key: "0",
                                      },
                                      {
                                        label: (
                                          <div
                                            onClick={() => {
                                              handleDeleteNuggetComment(
                                                elem.comment_id
                                              );
                                            }}
                                          >
                                            Delete
                                          </div>
                                        ),
                                        key: "1",
                                      },
                                    ],
                                  }}
                                  trigger={["click"]}
                                >
                                  <div className={classes.moreBtn}>
                                    <i className="material-symbols-outlined">
                                      more_horiz
                                    </i>
                                  </div>
                                </Dropdown>
                              )}
                            </div>
                            <div className="clearfix"></div>
                            <div
                              className={classes.agree}
                              style={{ color: elem.liked ? "#e26386" : "#000" }}
                            >
                              <i
                                className={classes.agreeIcon}
                                onClick={() => {
                                  handleAgree(
                                    elem.comment_id,
                                    elem.liked,
                                    elem.like_count
                                  );
                                }}
                                style={{
                                  background: elem.liked ? "#e26386" : "#000",
                                }}
                              />
                              <span
                                onClick={() => {
                                  handleAgree(
                                    elem.comment_id,
                                    elem.liked,
                                    elem.like_count
                                  );
                                }}
                              >
                                Agree
                              </span>
                              <span
                                onClick={() => {
                                  setAgreedUsersList({
                                    show: true,
                                    formData: {
                                      id: elem.comment_id,
                                      type: 2,
                                    },
                                  });
                                }}
                              >
                                {elem.like_count
                                  ? `(${elem.like_count})`
                                  : null}
                              </span>
                            </div>
                            <div className={classes.time}>
                              {dateToShortDate(
                                elem.commented_date,
                                userSettings?.time_zone
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-2">
                {/* <span>Comments is Empty</span> */}
              </div>
            )}
          </div>
        )}
        {isReplyEnabled === comment_id && (
          <div className={classes.replyCommentContainer}>
            <div className={`${classes.comtArea} ${classes.replyCmtArea}`}>
              <div className={classes.proImg}>
                <img
                  src={loginUserData?.profile_image}
                  alt={loginUserData?.profile_image}
                />
              </div>
              <div className={classes.textBox}>
                <div className={classes.inputSec}>
                  <Input.TextArea
                    placeholder="Write your reply here..."
                    id={`replytxtInput_${comment_id}`}
                    value={ReplyTxt[index]}
                    onChange={(e) => {
                      let tempData = [...ReplyTxt];
                      tempData[index] = e.target.value;
                      setReplyTxt(tempData);
                    }}
                  />
                  <Popover
                    getPopupContainer={(trigger) => trigger.parentElement}
                    overlayClassName="emojipopover"
                    content={
                      <div style={{}}>
                        <EmojiPicker
                          emojiButtonColors={["#364157"]}
                          emojiButtonRadius="8px"
                          skinTonePosition="none"
                          previewPosition="none"
                          categories={[
                            "people",
                            "nature",
                            "foods",
                            "activity",
                            "places",
                            "objects",
                            "symbols",
                            "flags",
                          ]}
                          onEmojiSelect={(e) => {
                            // console.log(e);
                            let tempData = [...ReplyTxt];
                            if (tempData[index]) {
                              tempData[index] = tempData[index].concat(
                                e.native
                              );
                            } else {
                              tempData[index] = e.native;
                            }

                            setReplyTxt(tempData);
                          }}
                        />
                      </div>
                    }
                    trigger="click"
                  >
                    <img
                      className={classes.emojiicon}
                      src={emoji}
                      alt="emoji"
                    />
                  </Popover>

                  <img
                    className={classes.sendicon}
                    alt="Send_icon"
                    src={sendicon}
                    onClick={() => {
                      if (isValidData(ReplyTxt[index])) {
                        AddCommentforAnugget(nugget_id, ReplyTxt[index]);
                        let tempData = [...ReplyTxt];
                        tempData[index] = "";
                        setReplyTxt(tempData);
                      } else {
                        toast.remove("rawcaster");
                        toast.error("Please Enter Valid Comment", {
                          id: "rawcaster",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <span
              className={`material-symbols-outlined ${classes.replyClose}`}
              onClick={() => {
                setisReplyEnabled("");
              }}
            >
              close
            </span>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="my-2"></div>
  );
};

export default ReplyList;
