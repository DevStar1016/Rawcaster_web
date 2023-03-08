import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  addNuggetCommentService,
  deleteNuggetCommentService,
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
import EmojiPicker from "emoji-picker-react";

const CommentsList = ({ index }) => {
  const { getNuggetList } = useListNuggetContext();
  const { nugget_id, CommentList, getCommentList, isCommentLoading } =
    useSingleNuggetContext();
  const loginUserData = useAuthData();
  const [CommentTxt, setCommentTxt] = useState([]);
  const [isReplyEnabled, setisReplyEnabled] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

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
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  label: <div>Edit</div>,
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
          <Input
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
              if (showEmojis === nugget_id) {
                setShowEmojis("");
              } else {
                setShowEmojis(nugget_id);
              }
            }}
          />
          {showEmojis === nugget_id && (
            <div
              style={{
                position: "absolute",
                bottom: "90%",
                right: "50px",
                zIndex: 11,
              }}
            >
              <EmojiPicker
                previewConfig={{
                  showPreview: false,
                }}
                onEmojiClick={(e) => {
                  let tempData = [...CommentTxt];
                  if (tempData[index]) {
                    tempData[index] = tempData[index].concat(e.emoji);
                  } else {
                    tempData[index] = e.emoji;
                  }

                  setCommentTxt(tempData);
                }}
              />
            </div>
          )}
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
      </div>
    </div>
  );
};

export default CommentsList;
