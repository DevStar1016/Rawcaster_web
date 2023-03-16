import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  addNuggetCommentService,
  deleteNuggetCommentService,
  editNuggetCommentService,
} from "../../Services/ApiService";
import { isValidData, JSONtoformdata } from "../../Shared/Utility";
import classes from "./Nuggets.module.css";
import hearticon from "../../Assets/Images/svg/heart.svg";
import sendicon from "../../Assets/Images/svg/sendicon.svg";
import emoji from "../../Assets/Images/svg/emoji.svg";
import { Dropdown, Input, Spin } from "antd";
import { useAuthData } from "../../Shared/Reduxfetcher";
import dayjs from "dayjs";
import {
  useListNuggetContext,
  useSingleNuggetContext,
} from "../../Shared/Context";
import EmojiPicker from "../../UIComponents/EmojiPicker";

const ReplyList = ({ isReplyEnabled, comment_id, index = 0 }) => {
  const { getNuggetList } = useListNuggetContext();
  const { nugget_id, CommentList, getCommentList, isCommentLoading } =
    useSingleNuggetContext();
  const loginUserData = useAuthData();
  const [ReplyTxt, setReplyTxt] = useState([]);
  const [ReplyList, setReplyList] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
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
  }, []);

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
    let findData = ReplyList.find((ele) => ele.comment_id === comment_id);
    return findData;
  };

  return (
    <div className={classes.cmtSec} style={{ width: "90%" }}>
      {isCommentLoading ? (
        <div className="d-flex justify-content-center align-items-center py-2">
          <Spin
            size="large"
            spinning={true}
            style={{ textAlign: "center" }}
          ></Spin>
        </div>
      ) : (
        <>
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
                                let tempData = [...ReplyList];
                                tempData[ind].comment = e.target.value;
                                setReplyTxt(tempData);

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
                                  let tempData = [...ReplyList];
                                  tempData[ind].comment = tempData[
                                    ind
                                  ].comment.concat(e.native);
                                  setReplyTxt(tempData);
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
                          <img src={elem?.profile_image} alt={elem?.name} />
                        </div>
                        <div className={classes.rightitem}>
                          <div className="d-flex flex-row">
                            <div className={classes.cmtText}>
                              <p>{elem?.name}</p>
                              <span>{elem?.comment}</span>
                            </div>
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
                          </div>
                          <div className="clearfix"></div>
                          <div className={classes.agree}>
                            <img src={hearticon} alt="Agree" /> Agree
                          </div>

                          <div className={classes.time}>
                            {dayjs(elem?.created_date).fromNow(true)} ago
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
        </>
      )}
      {isReplyEnabled === comment_id && (
        <div className={classes.comtArea}>
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
                value={ReplyTxt[index]}
                onChange={(e) => {
                  let tempData = [...ReplyTxt];
                  tempData[index] = e.target.value;
                  setReplyTxt(tempData);
                }}
              />
              <img className={classes.emojiicon} src={emoji} alt="emoji" />
              <img
                className={classes.sendicon}
                alt="Send_icon"
                src={sendicon}
                onClick={() => {
                  AddCommentforAnugget(nugget_id, ReplyTxt[index]);
                  let tempData = [...ReplyTxt];
                  tempData[index] = "";
                  setReplyTxt(tempData);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyList;
