import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  addNuggetCommentService,
  deleteNuggetCommentService,
  editNuggetCommentService,
} from "../../Services/ApiService";
import { decodeHtml, isValidData, JSONtoformdata } from "../../Shared/Utility";
import classes from "./Nuggets.module.css";
import hearticon from "../../Assets/Images/svg/heart.svg";
import replyicon from "../../Assets/Images/svg/comment.svg";
import sendicon from "../../Assets/Images/svg/sendicon.svg";
import emoji from "../../Assets/Images/svg/emoji.svg";
import { Dropdown, Input, Spin } from "antd";
import { useAuthData } from "../../Shared/Reduxfetcher";
import dayjs from "dayjs";
import {
  useListNuggetContext,
  useSingleNuggetContext,
} from "../../Shared/Context";
import ReplyList from "./ReplyList";
import EmojiPicker from "../../UIComponents/EmojiPicker";

const CommentsList = ({ index }) => {
  const { getNuggetList } = useListNuggetContext();
  const { nugget_id, CommentList, getCommentList, isCommentLoading } =
    useSingleNuggetContext();
  const loginUserData = useAuthData();
  const [CommentTxt, setCommentTxt] = useState([]);
  const [EditData, seteditData] = useState([]);
  const [isReplyEnabled, setisReplyEnabled] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
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
          getNuggetList();
          getCommentList(id);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
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
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleDeleteNuggetComment = (comment_id) => {
    let deleteComment = {
      token: loginUserData?.token,
      comment_id: comment_id,
    };
    deleteNuggetCommentService(JSONtoformdata(deleteComment))
      .then((res) => {
        if (res.data.status === 1) {
          getNuggetList();
          getCommentList(nugget_id);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getCommentValue = (comment_id) => {
    let findData = CommentList.find((ele) => ele.comment_id === comment_id);
    return findData;
  };

  return (
    <div className={classes.cmtSec}>
      {isCommentLoading ? (
        <div className="d-flex justify-content-center align-items-center py-2">
          <Spin
            size="large"
            spinning={true}
            style={{ textAlign: "center" }}
          ></Spin>
        </div>
      ) : (
        <div className={classes.commentContainer}>
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
                                setCommentTxt(tempData);

                                if (EditData.length === 0) {
                                  seteditData([editData]);
                                } else {
                                  seteditData((pre) => [...pre, editData]);
                                }
                              }}
                            />
                            <img
                              className={classes.emojiicon}
                              alt="emoji"
                              src={emoji}
                              onClick={() => {
                                if (showEmojis === elem.comment_id) {
                                  setShowEmojis("");
                                } else {
                                  setShowEmojis(elem.comment_id);
                                }
                              }}
                            />

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
                                    setShowEmojis("");
                                  } else {
                                    toast.error("Please Enter Valid Comment");
                                  }
                                }
                              }}
                            />
                          </div>
                          {showEmojis === elem.comment_id && (
                            <div
                              style={
                                {
                                  // position: "absolute",
                                  // bottom: "90%",
                                  // right: "50px",
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
                                  let tempData = [...CommentList];
                                  tempData[ind].comment = tempData[
                                    ind
                                  ].comment.concat(e.native);
                                  setCommentTxt(tempData);
                                  let editData = {
                                    ...getCommentValue(elem.comment_id),
                                    comment: getCommentValue(
                                      elem.comment_id
                                    ).comment.concat(e.native),
                                  };
                                  let findIndex = EditData.findIndex(
                                    (ele) => ele.comment_id === elem.comment_id
                                  );
                                  if (findIndex !== -1) {
                                    let tmpData = [...EditData];
                                    tmpData[findIndex] = editData;
                                    seteditData(tmpData);
                                  } else {
                                    if (EditData.length === 0) {
                                      seteditData([editData]);
                                    } else {
                                      seteditData((pre) => [...pre, editData]);
                                    }
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={classes.item}>
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
                                  <i class="material-symbols-outlined">
                                    more_horiz
                                  </i>
                                </div>
                              </Dropdown>
                            )}
                          </div>
                          <div className="clearfix"></div>
                          <div className={classes.agree}>
                            <img src={hearticon} alt="Heart_Icon" /> Agree
                          </div>
                          <div
                            className={classes.agree}
                            onClick={() => {
                              if (isReplyEnabled) {
                                setisReplyEnabled("");
                              } else {
                                setisReplyEnabled(elem.comment_id);
                              }
                            }}
                          >
                            <img src={replyicon} alt="reply_icon" /> Reply
                          </div>
                          <div className={classes.time}>
                            {dayjs(elem?.created_date).fromNow(true)} ago
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <ReplyList
                        isReplyEnabled={isReplyEnabled}
                        comment_id={elem.comment_id}
                        index={ind}
                      />
                    </div>
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
            <img
              className={classes.emojiicon}
              alt="emoji"
              src={emoji}
              onClick={() => {
                console.log(showEmojis);
                if (showEmojis === nugget_id) {
                  setShowEmojis("");
                } else {
                  setShowEmojis(nugget_id);
                }
              }}
            />

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
                  setShowEmojis("");
                } else {
                  toast.error("Please Enter Valid Comment");
                }
              }}
            />
          </div>
          {showEmojis === nugget_id && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
