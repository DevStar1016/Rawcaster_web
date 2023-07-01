import React, { useState } from "react";
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
import replyicon from "../../Assets/Images/svg/comment.svg";
import sendicon from "../../Assets/Images/svg/sendicon.svg";
import emoji from "../../Assets/Images/svg/emoji.svg";
import { Dropdown, Input, Popover } from "antd";
import { useAuth, useAuthData } from "../../Shared/Reduxfetcher";
import { useSingleNuggetContext } from "../../Shared/Context";
import ReplyList from "./ReplyList";
import EmojiPicker from "../../UIComponents/EmojiPicker";
import moment from "moment";

const CommentsList = ({ index }) => {
  const {
    nugget_id,
    CommentList,
    getCommentList,
    isCommentLoading,
    handleNuggetCommentLike,
    setCommentList,
    getNuggetDetail,
    setAgreedUsersList,
  } = useSingleNuggetContext();
  const { userSettings } = useAuth();
  const loginUserData = useAuthData();
  const [CommentTxt, setCommentTxt] = useState([]);
  const [EditData, seteditData] = useState([]);
  const [isReplyEnabled, setisReplyEnabled] = useState(false);
  const [isActiveEdit, setisActiveEdit] = useState("");

  const AddCommentforAnugget = (id, comment, type = 1) => {
    let addComment = {
      token: loginUserData?.token,
      type: type,
      nugget_id: id,
      comment: comment,
    };
    addNuggetCommentService(JSONtoformdata(addComment))
      .then((res) => {
        if (res.data.status === 1) {
          getCommentList(id).then(() => {
            getNuggetDetail();
          });
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

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
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

  const handleDeleteNuggetComment = (comment_id) => {
    let deleteComment = {
      token: loginUserData?.token,
      comment_id: comment_id,
    };
    deleteNuggetCommentService(JSONtoformdata(deleteComment))
      .then((res) => {
        if (res.data.status === 1) {
          getCommentList(nugget_id).then(() => {
            getNuggetDetail();
          });
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

  const getCommentValue = (comment_id) => {
    let findData = CommentList.find((ele) => ele.comment_id === comment_id);
    return findData;
  };

  const handleAgree = (id, like, count) => {
    let findIndex = CommentList.findIndex((ele) => ele.comment_id === id);
    let tempData = [...CommentList];
    tempData[findIndex] = {
      ...tempData[findIndex],
      liked: !like,
      like_count: !like ? count + 1 : count - 1,
    };
    setCommentList(tempData);
    let likeflag = like ? 2 : 1;
    handleNuggetCommentLike(id, likeflag)
      .then((res) => {
        if (res.status === 0) {
          let tempData = [...CommentList];
          tempData[findIndex] = {
            ...tempData[findIndex],
            liked: count,
          };
          setCommentList(tempData);
        }
      })
      .catch((err) => {
        let tempData = [...CommentList];
        tempData[findIndex] = {
          ...tempData[findIndex],
          liked: count,
        };
        setCommentList(tempData);
      });
  };

  return (
    <div className={classes.cmtSec}>
      {isCommentLoading ? null : (
        // <div className="d-flex justify-content-center align-items-center py-2">
        //   <Spin
        //     size="large"
        //     spinning={true}
        //     style={{ textAlign: "center" }}
        //   ></Spin>
        // </div>
        <div className={classes.commentContainer} style={{ marginTop: "15px" }}>
          {CommentList.length !== 0 ? (
            <>
              {CommentList.map((elem, ind) => {
                return (
                  <>
                    {isActiveEdit === elem.comment_id ? (
                      <div className={classes.comtArea}>
                        <div className={classes.proImg}>
                          <img
                            src={loginUserData?.profile_image}
                            alt="profile_image"
                          />
                        </div>
                        <div className={classes.textBox}>
                          <div className={classes.inputSec}>
                            <Input.TextArea
                              placeholder="Write your Comment here..."
                              value={getCommentValue(elem.comment_id).comment}
                              onChange={(e) => {
                                let editData = {
                                  ...getCommentValue(elem.comment_id),
                                  comment: e.target.value,
                                };
                                let tempData = [...CommentList];
                                tempData[ind].comment = e.target.value;
                                setCommentList(tempData);
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
                                      let tempData = [...CommentList];
                                      tempData[ind].comment = tempData[
                                        ind
                                      ].comment.concat(e.native);
                                      setCommentList(tempData);
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
                                    toast.error("Please Enter Valid Comment");
                                  }
                                } else {
                                  setisActiveEdit("");
                                }
                              }}
                            />
                          </div>
                        </div>
                        <span
                          class={`material-symbols-outlined ${classes.closeIcon}`}
                          onClick={() => {
                            setisActiveEdit(null);
                          }}
                        >
                          close
                        </span>
                      </div>
                    ) : (
                      <div
                        className={classes.item}
                        id={ind === CommentList.length - 1 ? "focus" : ""}
                      >
                        <div className={classes.proImg}>
                          <img
                            src={elem?.profile_image}
                            alt={elem?.profile_image}
                          />
                        </div>
                        <div className={classes.rightitem}>
                          <div className="d-flex flex-row">
                            <div className={classes.cmtText}>
                              <p>{decodeHtml(elem?.name)}</p>
                              <span>{decodeHtml(elem?.comment)}</span>
                            </div>
                            {elem.user_id === loginUserData?.user_id && (
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
                                  <i class="material-symbols-outlined">
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
                              {elem.like_count ? `(${elem.like_count})` : null}
                            </span>
                          </div>
                          <div
                            className={classes.agree}
                            onClick={() => {
                              setisReplyEnabled(elem.comment_id);
                              document
                                .getElementById(
                                  `replytxtInput_${elem.comment_id}`
                                )
                                .focus();
                            }}
                          >
                            <img src={replyicon} alt="reply_icon" /> Reply
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

                    <ReplyList
                      isReplyEnabled={isReplyEnabled}
                      setisReplyEnabled={setisReplyEnabled}
                      comment_id={elem.comment_id}
                      index={ind}
                    />
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
      <div className={classes.comtArea}>
        <div className={classes.proImg}>
          <img src={loginUserData?.profile_image} alt="profile_image" />
        </div>
        <div className={classes.textBox}>
          <div className={classes.inputSec}>
            <Input.TextArea
              placeholder="Write your Comment here..."
              value={CommentTxt[index]}
              onChange={(e) => {
                let tempData = [...CommentTxt];
                tempData[index] = e.target.value;
                setCommentTxt(tempData);
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
                      let tempData = [...CommentTxt];
                      if (tempData[index]) {
                        tempData[index] = tempData[index].concat(e.native);
                      } else {
                        tempData[index] = e.native;
                      }

                      setCommentTxt(tempData);
                    }}
                  />
                </div>
              }
              trigger="click"
            >
              <img
                className={classes.emojiicon}
                id={`emoji_${nugget_id}`}
                alt="emoji"
                src={emoji}
              />
            </Popover>
            <img
              className={classes.sendicon}
              src={sendicon}
              alt="send_icon"
              onClick={() => {
                if (isValidData(CommentTxt[index])) {
                  AddCommentforAnugget(nugget_id, CommentTxt[index]);
                  let tempData = [...CommentTxt];
                  tempData[index] = "";
                  setCommentTxt(tempData);
                } else {
                  toast.error("Please Enter Valid Comment");
                }
              }}
            />
          </div>
          {/* {showEmojis === nugget_id && (
            <div
              style={
                {
                  // position: "absolute",
                  // zIndex: 11,
                }
              }
            >
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
                  // console.log(e);
                  let tempData = [...CommentTxt];
                  if (tempData[index]) {
                    tempData[index] = tempData[index].concat(e.native);
                  } else {
                    tempData[index] = e.native;
                  }

                  setCommentTxt(tempData);
                }}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
